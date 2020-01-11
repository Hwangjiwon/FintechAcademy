# -*- coding: utf-8 -*-
import sys
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')

driver.get('https://www.seoul.co.kr/news/newsView.php?id=20191204001018&wlog_sub=svt_006');
title = driver.find_element_by_xpath('//*[@id="atic_txt1"]/text()[11]')
print(title.text) 