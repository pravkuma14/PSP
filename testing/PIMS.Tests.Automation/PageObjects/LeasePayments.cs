﻿using OpenQA.Selenium;

namespace PIMS.Tests.Automation.PageObjects
{
    public class LeasePayments : PageObjectBase
    {
        private By licensePaymentsLink = By.XPath("//a[contains(text(),'Payments')]");
        private By licensePaymentsTotal = By.CssSelector("div[data-testid='leasePaymentsTable'] div[class='tr-wrapper'] div[class='td expander svg-btn']");

        private By licensePaymentsModal = By.CssSelector("div[class='modal-content']");
        private By licensePaymentTermStartDateInput = By.Id("datepicker-startDate");
        private By licensePaymentTermEndDateInput = By.Id("datepicker-expiryDate");
        private By licensePaymentFrequencySelect = By.Id("input-leasePmtFreqTypeCode.id");
        private By licensePaymentAgreedPaymentInput = By.Id("input-paymentAmount");
        private By licensePaymentDueInput = By.Id("input-paymentDueDate");
        private By licensePaymentGSTRadioBttns = By.Name("isGstEligible");
        private By licensePaymentTermSelect = By.Id("input-statusTypeCode.id");

        private By licensePaymentSendDateInput = By.Id("datepicker-receivedDate");
        private By licensePaymentMethodSelect = By.Id("input-leasePaymentMethodType.id");
        private By licensePaymentAmountReceivedInput = By.Id("input-amountTotal");
        private By licensePaymentExpPaymentInput = By.Id("input-amountPreTax");
        private By licensePaymentGSTInput = By.Id("input-amountGst");

        //private By licensePaymentsTermTable = By.CssSelector("div[data-testid='securityDepositsTable']");
        private By licencePaymentsTable = By.CssSelector("div[data-testid='securityDepositsTable'] div[class='tr-wrapper']");

        private int totalTermsInLease;

        public LeasePayments(IWebDriver webDriver) : base(webDriver)
        { }

        //Navigates to Payments Section
        public void NavigateToPaymentSection()
        {
            Wait();
            webDriver.FindElement(licensePaymentsLink).Click();
        }

        public void AddTerm(string startDate, string endDate, string agreedPayment, string paymentDue, string gst, string termStatus)
        {
            Wait();
            ButtonElement("Add a Term");

            WaitUntil(licensePaymentsModal);

            var startDateInputElement = webDriver.FindElement(licensePaymentTermStartDateInput);

            if (startDateInputElement.GetAttribute("value") == "")
            {
                startDateInputElement.Click();
                startDateInputElement.SendKeys(startDate);
            }

            Wait();

            webDriver.FindElement(licensePaymentTermEndDateInput).Click();
            webDriver.FindElement(licensePaymentTermEndDateInput).SendKeys(endDate);

            var paymentFrequencyElement = webDriver.FindElement(licensePaymentFrequencySelect);
            ChooseRandomOption(paymentFrequencyElement, "input-leasePmtFreqTypeCode.id", 2);

            webDriver.FindElement(licensePaymentAgreedPaymentInput).Click();
            webDriver.FindElement(licensePaymentAgreedPaymentInput).SendKeys(agreedPayment);
            webDriver.FindElement(licensePaymentDueInput).SendKeys(paymentDue);

            ChooseSpecificRadioButton("isGstEligible", gst);
            ChooseSpecificOption("input-statusTypeCode.id", termStatus); 

            ButtonElement("Save term");
        }

        public void OpenLastPaymentTab()
        {
            Wait();

            totalTermsInLease = webDriver.FindElements(licensePaymentsTotal).Count();

            var selectedExpander = webDriver.FindElement(By.XPath("//div[@class='tr-wrapper']["+ totalTermsInLease +"]/div/div[@class='td expander svg-btn']"));
            selectedExpander.Click();
        }

        public void AddPayment(string sentDate, string totalReceived, string status)
        {

            Wait();
            ButtonElement("Record a Payment");

            WaitUntil(licensePaymentsModal);

            webDriver.FindElement(licensePaymentSendDateInput).Click();
            webDriver.FindElement(licensePaymentSendDateInput).SendKeys(sentDate);

            var paymentMethodElement = webDriver.FindElement(licensePaymentMethodSelect);
            webDriver.FindElement(licensePaymentsModal).Click();
            ChooseRandomOption(paymentMethodElement, "input-leasePaymentMethodType.id", 1);

            webDriver.FindElement(licensePaymentAmountReceivedInput).SendKeys(totalReceived);

            ButtonElement("Save payment");

            Wait();

            var totalPayments = webDriver.FindElements(licencePaymentsTable).Count();
            var paymentStatus = webDriver.FindElement(By.CssSelector("div[data-testid='securityDepositsTable'] div[class='tr-wrapper']:nth-child("+ totalPayments +") div:nth-child(6)")).Text;

            Assert.True(paymentStatus.Equals(status));
        }
    }
}