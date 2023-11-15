import { env } from 'node:process'
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
import cheerio from 'cheerio'

const prisma = new PrismaClient()

async function main() {
  await deleteMenu()
  const tableData = await extractTableDataFromMarkdown(env.CC_PATH)
  const filteredData = tableData?.filter(data =>
    data.description.includes('😄')
    && !data.description.includes('🛫')
    && !data.description.includes('🔑'),
  )
  filteredData?.map(async (data, index) => {
    await prisma.menus.create({
      data: {
        title: data.title,
        windowName: `gptMirror${index}`,
        url: data.href,
      },
    })
  })
}

main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

// 清空menu表deleteMany
async function deleteMenu() {
  const menu = await prisma.menus.deleteMany()
  console.log(menu)
}
async function extractTableDataFromMarkdown(markdownFile: any) {
  const markdownContent = fs.readFileSync(markdownFile, 'utf-8')

  const tableRegex = /<table>([\s\S]*?)<\/table>/
  const tableMatch = markdownContent.match(tableRegex)

  if (tableMatch) {
    const tableHtml = tableMatch[0]
    const $ = cheerio.load(tableHtml)
    const tableData: { href: any; title: any; description: any }[] = []
    const tableRows = $('tr')

    tableRows.each((index: any, element: any) => {
      const row = $(element)
      const rowCells = row.find('td')
      const rowData = {
        // id: rowCells.eq(0).text().trim(),
        href: rowCells.eq(2).find('a').attr('href'),
        title: rowCells.eq(2).find('a').text(),
        description: rowCells.eq(3).text().trim(),
      }
      tableData.push(rowData)
    })

    return tableData
  }
  else {
    return null
  }
}
