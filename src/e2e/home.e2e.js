import puppeteer from 'puppeteer';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'],
      //直接指定 chrome.exe 的位置，注意路径使用双反斜杠
      executablePath: 'C:\\Users\\admin\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#logo h1');
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('<h1>Ant Design Pro</h1>');
    await page.close();
    browser.close();
  });
});
