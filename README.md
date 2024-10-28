# UI Automation with Playwright

This is a test suite in Playwright, for Sauce Demo web app running in a local Docker container  

## Run tests
1. Clone the repo
2. Create .env file following "env README.txt" directions
3. Install dependencies: `npm install`
4. Run tests from **sauce-labs** folder:  
   `npx playwright test --ui` for test runner

## Test cases
![screenshot](https://github.com/egaraujo/sauce-labs-ui-automation/blob/main/screenshot.jpg)
• Should not login username with no password  
• Should not login missing username with password  
• Should not login inexistent user  
• Should not login locked out user  
• Should login standard user  
• Should display all available products  
• Should link to the about website  
• Should log user out  
• Should reset the app state  
• Should verify footer link for: Twitter  
• Should verify footer link for: Facebook  
• Should verify footer link for: LinkedIn  
• Should verify footer text  
• Should sort products by ascending name  
• Should sort products by descending name  
• Should sort products by ascending price  
• Should sort products by descending price  
• Should check out selected products  

## Links
Sauce Demo web app: https://www.saucedemo.com/  
Sauce Demo repo: https://github.com/saucelabs/sample-app-web
