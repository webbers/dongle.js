using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Remote;

namespace QUnitTestRunner
{
    [TestClass]
    public class BrowsersTest
    {
        private readonly List<string> _files = new List<string>();

        public BrowsersTest()
        {
            var html = this.GetUrlContent("http://localhost:55128/Test");
            var matches = Regex.Matches(html, @"&lt;dir&gt;\s+<A\s+href=""(\w+)");

            foreach (Match match in matches)
            {
                var html2 = this.GetUrlContent("http://localhost:55128/Test/" + match.Groups[1].Value);
                if(Regex.IsMatch(html2, @"href=""test.html"))
                {
                    _files.Add("Test/" +  match.Groups[1].Value + "/test.html");
                }
            }
        }

        [TestMethod]
        public  void TestFirefox()
        {
            using (var driver = new FirefoxDriver())
            {
                RunTests(_files, driver);
            }
        }

       [TestMethod, DeploymentItem("IEDriverServer.exe")]
        public void TestIe()
       {
           var options = new InternetExplorerOptions
                             {
                                 IntroduceInstabilityByIgnoringProtectedModeSettings = true
                             };
           using (var driver = new InternetExplorerDriver(options))
            {
                RunTests(_files, driver);
            }
        }

        [TestMethod, DeploymentItem("chromedriver.exe")]
        public  void TestChrome()
        {
            var options = new ChromeOptions();
            options.AddArgument("--start-maximized");
            options.AddArgument("--allow-outdated-plugins");
            options.AddArgument("--always-authorize-plugins");
            options.AddArgument("--profile-directory=Default");

            using (var driver = new ChromeDriver(options))
            {
                RunTests(_files, driver);
            }
        }

        private static void RunTests(IEnumerable<string> files, RemoteWebDriver driver)
        {
            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(60));

            foreach (var file in files)
            {
                driver.Navigate().GoToUrl("http://localhost:55128/" + file);

                var element = driver.FindElementById("qunit-testresult");

                var tries = 0;
                while (element.Text.Contains("completed") == false)
                {
                    if (tries == 10)
                    {
                        Assert.Fail("Timeout ao tentar pegar se o teste está completo");
                    }
                    System.Threading.Thread.Sleep(1000);
                    tries++;
                }
                var match = Regex.Match(element.Text, "(\\d+) failed");

                var errorCount = Convert.ToInt32(match.Groups[1].Value);

                if (errorCount > 0)
                {
                    Assert.Fail("Arquivo '" + file + "' contém " + errorCount + " erros.");
                }
            }
            driver.Close();
        }

        private string GetUrlContent(string url)
        {
            var myRequest = (HttpWebRequest)WebRequest.Create(url);
            myRequest.Method = "GET";
            var myResponse = myRequest.GetResponse();
            var sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
            string result = sr.ReadToEnd();
            sr.Close();
            myResponse.Close();

            return result;
        }
    }
}
