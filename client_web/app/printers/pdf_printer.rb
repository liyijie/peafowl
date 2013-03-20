#encoding: utf-8
require "win32ole"

module PdfPrinter

  FOXIT_EXE = "C:/Program Files/Foxit Software/Foxit Reader/Foxit Reader.exe"

  # 发送pdf文件到指定的打印机
  def print_pdf_file filename, printer
    filename = "c:/放假通知.pdf"
    printer = "发送至 OneNote 2010"
    shell = WIN32OLE.new('Shell.Application')
    shell.ShellExecute(FOXIT_EXE,"/t \"#{filename}\" \"#{printer}\"")
  end

end