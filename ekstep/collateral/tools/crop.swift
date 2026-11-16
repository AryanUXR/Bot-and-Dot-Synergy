import AppKit
// crop.swift in out width height : keeps the top-left width x height pixels
let a = CommandLine.arguments
let img = NSImage(contentsOfFile: a[1])!
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
let w = Int(a[3])!, h = Int(a[4])!
let cg = rep.cgImage!.cropping(to: CGRect(x: 0, y: 0, width: w, height: h))!
try! NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
