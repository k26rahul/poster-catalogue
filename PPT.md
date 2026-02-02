# Poster Catalog App

---

## Slide 1: The Problem

- My father sells posters and photo frames
- He orders posters from a dealer
- Dealer gives him many PDF catalogs
- Each PDF has poster images and codes
- He writes orders on paper by hand

---

## Slide 2: Why It's Hard

- Too much manual work
- Easy to make mistakes
- Cannot change orders easily
- Cannot see poster images while ordering
- Hard to track what is ordered

---

## Slide 3: My Solution

- Build a digital poster catalog
- Show poster images with their codes
- Easy to select and modify orders
- Clear view of selected items
- Generate PDF order for dealer

---

## Slide 4: PDF Parsing Challenge

- PDFs come in three types:
  - Single poster per page
  - Multiple posters per page
  - Poster codes as images (need OCR)
- Used PyMuPDF for parsing
- Used Tesseract for OCR
- Output: structured JSON data

---

## Slide 5: Data Architecture

- Poster Object: image, code, PDF source
- Category Object: name and description
- PDF Object: path, name, poster list
- Metadata file for quick loading
- Detail files for full poster data

---

## Slide 6: Frontend Design

- Built with Vue.js and Vite
- No external stores needed
- Vue reactive objects for data
- Simple and fast interface

---

## Slide 7: User Workflow

- Home shows PDFs by category
- Select PDF to browse posters
- Pick posters and set quantity
- Choose size and material
- Add to checkout as a batch
- Repeat for more orders
- Generate final PDF for dealer

---

## Slide 8: Result

- No more paper orders
- Easy to modify selections
- Visual catalog experience
- Fast order generation
- Ready to send to dealer
