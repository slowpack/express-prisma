import fs from 'fs';
import axios from 'axios';
import cheerio from "cheerio";


export async function extractTableDataFromMarkdown(markdownFile) {
  const markdownContent = fs.readFileSync(markdownFile, 'utf-8');

  const tableRegex = /<table>([\s\S]*?)<\/table>/;
  const tableMatch = markdownContent.match(tableRegex);

  if (tableMatch) {
    const tableHtml = tableMatch[0];
    const $ = cheerio.load(tableHtml);
    const tableData = [];
    const tableRows = $('tr');

    tableRows.each((index, element) => {
      const row = $(element);
      const rowCells = row.find('td');
      const rowData = {
        id: rowCells.eq(0).text().trim(),
        href: rowCells.eq(2).find('a').attr('href'),
        title: rowCells.eq(2).find('a').text(),
        description: rowCells.eq(3).text().trim(),
      };
      tableData.push(rowData);
    });

    return tableData;
  } else {
    return null;
  }
}

async function testLinkConnectivity(link) {
  try {
    const startTime = Date.now();
    const response = await axios.get(link, { timeout: 3000 });
    if (response.status === 200) {
      const endTime = Date.now();
      return endTime - startTime;
    }
  } catch (error) {
    // 处理异常情况
  }

  return -1;
}

export async function  getMirror() {
  const markdownFilePath = '/project/chat-server/cc.md';
  const tableData = await extractTableDataFromMarkdown(markdownFilePath);
  const filteredData = tableData.filter((data) => {
    return (
      data.description.includes('😄') &&
      !data.description.includes('🛫') &&
      !data.description.includes('🔑')
    );
  });
  const tasks = filteredData.map((data) =>
    testLinkConnectivity(data.href)
  );
  const results = await Promise.all(tasks);
  const successDict = {};
  let successId = 1;

  filteredData.forEach((data, index) => {
    const link = data.href;
    const title = data.title;
    const result = results[index];
      successDict[successId] = {
        index: successId,
        title: title,
        delay: result==-1 ? Infinity: parseInt(result),
        url: link,
      };
      successId++;
  });
  const sortedSuccessDict = Object.values(successDict).sort(
    (a, b) => a.delay - b.delay
  );

  sortedSuccessDict.forEach((data, index) => {
    data.index = (index + 1).toString();
  });
  console.log(sortedSuccessDict)
  return sortedSuccessDict;
}

// 异步执行主函数
// getMirror();
