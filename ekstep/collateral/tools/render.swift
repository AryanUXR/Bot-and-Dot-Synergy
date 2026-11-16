import PDFKit
import AppKit
// render.swift deck.pdf outdir : one PNG per page (p1.png, p2.png, ...) for visual QA
let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
print("pages", doc.pageCount)
for i in 0..<doc.pageCount {
  let p = doc.page(at: i)!
  let img = p.thumbnail(of: NSSize(width: 900, height: 1165), for: .mediaBox)
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(a[2])/p\(i+1).png"))
}
