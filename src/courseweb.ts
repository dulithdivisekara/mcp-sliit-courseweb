import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

export interface Course {
    id: string;
    name: string;
    url: string;
}

export interface Announcement {
    title: string;
    date: string;
    author: string;
    link: string;
}

export class CoursewebClient {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;

    private getLaunchOptions(headless: boolean = true) {
        const options: any = { headless };
        if (process.env.CHROME_PATH) {
            options.executablePath = process.env.CHROME_PATH;
        } else if (fs.existsSync('/usr/bin/google-chrome')) {
            options.executablePath = '/usr/bin/google-chrome';
        } else if (fs.existsSync('/usr/bin/google-chrome-stable')) {
            options.executablePath = '/usr/bin/google-chrome-stable';
        } else if (fs.existsSync('/usr/bin/chromium-browser')) {
            options.executablePath = '/usr/bin/chromium-browser';
        } else {
            options.channel = 'chrome';
        }
        return options;
    }

    async init() {
        this.browser = await chromium.launch(this.getLaunchOptions(process.env.HEADLESS !== 'false'));
        
        const sessionPath = path.resolve(__dirname, '../storage_state.json');
        
        try {
            this.context = await this.browser.newContext({
                storageState: sessionPath
            });
        } catch (e) {
            this.context = await this.browser.newContext();
        }
    }

    async setSessionCookie(cookieValue: string) {
        if (!this.browser) await this.init();
        // Create a temporary context to set the cookie and save the state
        const tempContext = await this.browser!.newContext();
        
        await tempContext.addCookies([{
            name: 'MoodleSession',
            value: cookieValue,
            domain: 'courseweb.sliit.lk',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }]);
        
        const sessionPath = path.resolve(__dirname, '../storage_state.json');
        await tempContext.storageState({ path: sessionPath });
        await tempContext.close();
        
        // Re-init the main context to use the new cookie
        if (this.context) {
            await this.context.close();
            await this.init();
        }
        
        return `Successfully injected MoodleSession cookie and saved state to ${sessionPath}`;
    }

    async interactiveLogin() {
        // Force a visible browser specifically for interactive login
        const interactiveBrowser = await chromium.launch(this.getLaunchOptions(false));
        const loginContext = await interactiveBrowser.newContext();
        const page = await loginContext.newPage();
        
        console.error("Opening browser for interactive login...");
        await page.goto('https://courseweb.sliit.lk/login/index.php');
        
        try {
            await page.waitForURL('**/my/**', { timeout: 120000 });
            console.error("Login successful! Saving session...");
            const sessionPath = path.resolve(__dirname, '../storage_state.json');
            await loginContext.storageState({ path: sessionPath });
            return `Login successful! Session saved to ${sessionPath}. All other tools will now run in the background (headless).`;
        } catch (error) {
            return "Login timed out or failed. Please try again.";
        } finally {
            await loginContext.close();
            await interactiveBrowser.close();
            
            // If the main client browser was running, we re-initialize it to pick up the new cookie
            if (this.browser) {
                await this.browser.close();
                await this.init();
            }
        }
    }

    async login() {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        
        await page.goto('https://courseweb.sliit.lk/my/');

        if (page.url().includes('/my/')) {
            await page.close();
            return true;
        }

        await page.goto('https://courseweb.sliit.lk/login/index.php');
        
        const loginButton = page.locator('.login-identityprovider-btn');
        if (await loginButton.count() > 0) {
            await loginButton.click();
            await page.waitForSelector('input[type="email"]');
            const username = process.env.SLIIT_USERNAME?.includes('@')
                ? process.env.SLIIT_USERNAME
                : `${process.env.SLIIT_USERNAME}@my.sliit.lk`;
            await page.fill('input[type="email"]', username);
            await page.click('input[type="submit"]');

            if (process.env.SLIIT_PASSWORD) {
                try {
                    await page.waitForSelector('input[type="password"]', { timeout: 8000 });
                    await page.fill('input[type="password"]', process.env.SLIIT_PASSWORD);
                    await page.click('input[type="submit"]');

                    // If "Stay signed in?" (KMSI) screen appears
                    const staySignedInBtn = page.locator('input[type="submit"][value="Yes"], #idSIButton9');
                    if (await staySignedInBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                        await staySignedInBtn.click();
                    }
                } catch {
                    // Password input might be skipped or MFA required
                }
            }
        } else {
            await page.fill('#username', process.env.SLIIT_USERNAME || '');
            await page.fill('#password', process.env.SLIIT_PASSWORD || '');
            await page.click('#loginbtn');
        }

        try {
            await page.waitForURL('**/my/**', { timeout: 30000 });
            const sessionPath = path.resolve(__dirname, '../storage_state.json');
            await this.context.storageState({ path: sessionPath });
            await page.close();
            return true;
        } catch (e) {
            await page.close();
            throw new Error("Session expired and auto-login failed. Please run the 'interactive_login' tool to refresh your MFA session.");
        }
    }

    async getEnrolledCourses(): Promise<Course[]> {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto('https://courseweb.sliit.lk/my/courses.php', { waitUntil: 'networkidle' });

        try {
            await page.waitForSelector('.course-info-container, .coursename, [data-region="course-content"], .dashboard-card', { timeout: 10000 });
            const courses = await page.evaluate(() => {
                const items = document.querySelectorAll('.course-info-container, .coursename, .dashboard-card, [data-region="course-content"] .card');
                const list: Array<{ id: string; name: string; url: string }> = [];
                const seenIds = new Set<string>();

                items.forEach(item => {
                    const anchor = item.querySelector('a') as HTMLAnchorElement;
                    if (!anchor || !anchor.href) return;
                    try {
                        const url = new URL(anchor.href);
                        const id = url.searchParams.get('id') || '';
                        const rawName = anchor.innerText.trim();
                        const lines = rawName.split('\n')
                            .map(l => l.trim())
                            .filter(l => l && !l.startsWith('Course is starred') && !l.startsWith('Course name') && !l.startsWith('Select course'));
                        const name = lines[0] || rawName;
                        if (id && name && !seenIds.has(id)) {
                            seenIds.add(id);
                            list.push({ id, name, url: anchor.href });
                        }
                    } catch {}
                });
                return list;
            });
            await page.close();
            return courses;
        } catch (e) {
            await page.close();
            throw new Error("Could not find the course list on /my/courses.php. Use the 'scrape_page' tool to investigate the layout.");
        }
    }

    async scrapePage(url: string): Promise<string> {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        
        const data = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, svg');
            scripts.forEach(s => s.remove());
            return document.body.innerText; 
        });
        
        await page.close();
        return data;
    }

    async getSiteAnnouncements(): Promise<Announcement[]> {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto('https://courseweb.sliit.lk/mod/forum/view.php?id=1'); 

        const announcements = await page.evaluate(() => {
            const rows = document.querySelectorAll('tr.discussion');
            return Array.from(rows).map(row => {
                const topic = row.querySelector('.topic a') as HTMLAnchorElement;
                const author = row.querySelector('.author')?.textContent?.trim() || '';
                const date = row.querySelector('.lastpost')?.textContent?.trim() || '';
                return {
                    title: topic.innerText.trim(),
                    link: topic.href,
                    author,
                    date
                };
            });
        });

        await page.close();
        return announcements;
    }

    async getModuleContent(courseId: string) {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto(`https://courseweb.sliit.lk/course/view.php?id=${courseId}`);

        const sections = await page.evaluate(() => {
            // Moodle 4.x uses .section elements for weeks/topics
            const sectionElements = document.querySelectorAll('.section');
            return Array.from(sectionElements).map(section => {
                const title = section.querySelector('h3.sectionname, .section-title')?.textContent?.trim() || 'General';
                
                // Activities are usually inside .activity-wrapper
                const activityElements = section.querySelectorAll('.activity-wrapper');
                const activities = Array.from(activityElements).map(act => {
                    const anchor = act.querySelector('a.aalink') as HTMLAnchorElement;
                    if (!anchor) return null;
                    
                    // Determine type based on class
                    let type: 'file' | 'assignment' | 'quiz' | 'other' = 'other';
                    if (act.classList.contains('resource')) type = 'file';
                    else if (act.classList.contains('assign')) type = 'assignment';
                    else if (act.classList.contains('quiz')) type = 'quiz';
                    
                    return {
                        name: anchor.innerText.trim().replace(/\s+File$/, '').replace(/\s+Assignment$/, ''),
                        url: anchor.href,
                        type
                    };
                }).filter(a => a !== null);
                
                return { title, activities };
            }).filter(s => s.activities.length > 0);
        });

        await page.close();
        return sections;
    }

    async getDeadlines() {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto('https://courseweb.sliit.lk/calendar/view.php?view=upcoming');

        const events = await page.evaluate(() => {
            const eventCards = document.querySelectorAll('.event');
            return Array.from(eventCards).map(card => {
                const title = card.querySelector('.name')?.textContent?.trim() || '';
                const descText = card.querySelector('.description')?.textContent?.trim() || '';
                const lines = descText.split('\n').map(l => l.trim()).filter(Boolean);
                const date = lines[0] || '';
                let course = card.querySelector('.course')?.textContent?.trim() || '';
                if (!course && lines.length > 1) {
                    const courseLine = lines.find(l => l.includes(' - ') || l.includes('[20'));
                    if (courseLine) course = courseLine;
                }
                return { title, date, course };
            });
        });

        await page.close();
        return events;
    }

    async downloadFile(url: string, outputDirectory: string = './downloads', customFilename?: string): Promise<string> {
        if (!this.context) throw new Error('Client not initialized');
        
        if (!fs.existsSync(outputDirectory)){
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        // Method 1: Fast direct request via Playwright's authenticated APIRequestContext
        try {
            let response = await this.context.request.get(url, { maxRedirects: 10 });
            
            // If Incapsula WAF blocks .sql or returns 403, retry with trailing slash bypass
            if (response.status() === 403 && response.url().includes('pluginfile.php')) {
                const base = response.url().split('?')[0] || '';
                const cleanUrl = base.replace(/\/+$/, '');
                response = await this.context.request.get(cleanUrl + '/?forcedownload=1');
            }

            const contentType = response.headers()['content-type'] || '';
            const contentDisposition = response.headers()['content-disposition'] || '';
            
            const isBinary = !contentType.includes('text/html') || contentDisposition.includes('filename=') || response.url().includes('pluginfile.php');
            
            if (response.status() === 200 && isBinary) {
                let filename = customFilename;
                if (!filename && contentDisposition) {
                    const match = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
                    if (match && match[1]) filename = decodeURIComponent(match[1].trim());
                }
                if (!filename) {
                    const cleanUrl = response.url().replace(/\/\?.*$/, '');
                    const urlPath = new URL(cleanUrl).pathname;
                    filename = path.basename(urlPath);
                }
                if (!filename || filename === 'view.php') {
                    filename = `download_${Date.now()}`;
                }

                const finalPath = path.resolve(outputDirectory, filename);
                const tempPath = path.resolve(outputDirectory, `.temp_${filename}`);
                const buffer = await response.body();

                if (fs.existsSync(finalPath)) {
                    const existingHash = crypto.createHash('md5').update(fs.readFileSync(finalPath)).digest('hex');
                    const newHash = crypto.createHash('md5').update(buffer).digest('hex');
                    if (existingHash === newHash) {
                        return `File already exists and is up-to-date: ${finalPath}`;
                    }
                }

                fs.writeFileSync(tempPath, buffer);
                fs.renameSync(tempPath, finalPath);
                return `Downloaded new or updated file: ${finalPath}`;
            }
        } catch (e: any) {
            // Direct request failed, fallback to browser page download
        }

        // Method 2: Browser page download fallback
        const page = await this.context.newPage();
        try {
            const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            
            const forceDownloadLink = await page.$('a[href*="forcedownload=1"], .resourceworkaround a');
            if (forceDownloadLink) {
                await forceDownloadLink.click();
            }
            
            const download = await downloadPromise;
            const suggestedName = customFilename || download.suggestedFilename();
            const finalPath = path.resolve(outputDirectory, suggestedName);
            const tempPath = path.resolve(outputDirectory, `.temp_${suggestedName}`);
            
            await download.saveAs(tempPath);
            
            if (fs.existsSync(finalPath)) {
                const existingHash = crypto.createHash('md5').update(fs.readFileSync(finalPath)).digest('hex');
                const newHash = crypto.createHash('md5').update(fs.readFileSync(tempPath)).digest('hex');
                
                if (existingHash === newHash) {
                    fs.unlinkSync(tempPath);
                    await page.close();
                    return `File already exists and is up-to-date: ${finalPath}`;
                }
            }
            
            fs.renameSync(tempPath, finalPath);
            await page.close();
            return `Downloaded new or updated file: ${finalPath}`;
        } catch (e: any) {
            await page.close();
            throw new Error(`Failed to download from ${url}. Error: ${e.message}`);
        }
    }

    async syncModule(courseId: string, outputDirectory: string = './downloads'): Promise<string[]> {
        const sections = await this.getModuleContent(courseId);
        const results: string[] = [];
        
        for (const section of sections) {
            for (const activity of section.activities) {
                if (activity.type === 'file' && activity.url) {
                    try {
                        const result = await this.downloadFile(activity.url, outputDirectory);
                        results.push(`[${section.title}] ${activity.name}: ${result}`);
                    } catch (e: any) {
                        results.push(`[${section.title}] ${activity.name}: Failed - ${e.message}`);
                    }
                }
            }
        }
        return results;
    }

    async checkAssignmentStatus(url: string) {
        if (!this.context) throw new Error('Client not initialized');
        const page = await this.context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        const status = await page.evaluate(() => {
            const table = document.querySelector('.generaltable');
            if (!table) return null;
            
            const result: Record<string, string> = {};
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const key = row.querySelector('th')?.textContent?.trim() || '';
                const value = row.querySelector('td')?.textContent?.trim() || '';
                if (key) {
                    result[key] = value;
                }
            });
            
            // Also try to grab the assignment title and description
            const title = document.querySelector('h2')?.textContent?.trim() || '';
            const description = document.querySelector('#intro')?.textContent?.trim() || '';
            
            return { title, description, status: result };
        });

        await page.close();
        return status || { error: "No submission status table found on this page." };
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}
