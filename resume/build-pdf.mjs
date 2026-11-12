// Renders resume/resume.html to public/ryan-craun-resume.pdf.
import puppeteer from 'puppeteer';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(dir, 'resume.html')).href, { waitUntil: 'load' });
await page.pdf({ path: path.join(dir, '..', 'public', 'ryan-craun-resume.pdf'), format: 'Letter', preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('wrote public/ryan-craun-resume.pdf');
