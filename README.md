# Poster Catalogue App

A digital catalogue system designed to streamline the poster ordering process for retail businesses.

---

## 📋 Problem Statement

### The Challenge

My father runs a shop selling posters and photo frames, ordering inventory from a dealer who provides product catalogues as PDF files. Each PDF contains poster images along with their corresponding codes.

### Pain Points with the Manual Process

| Issue                    | Impact                                                   |
| ------------------------ | -------------------------------------------------------- |
| **Paper-based tracking** | Difficult to modify order lists once written             |
| **No visual reference**  | Codes alone don't help identify poster appearance        |
| **Error-prone**          | High chance of mistakes when transcribing codes manually |
| **Poor traceability**    | Hard to track ordered vs. pending items                  |

### The Solution

A digital poster catalogue system that enables:

- Visual browsing of poster images with their codes
- Easy selection and quantity adjustment
- Flexible order list modification
- Clear tracking of ordered and pending items
- PDF generation for dealer submission

---

## 🛠️ Technical Implementation

### PDF Parsing

PDFs from the dealer fall into three categories, each requiring a different parsing approach:

| Category   | Description                     | Approach                |
| ---------- | ------------------------------- | ----------------------- |
| **Type 1** | Single poster image per page    | Direct image extraction |
| **Type 2** | Multiple poster images per page | Multi-region extraction |
| **Type 3** | Poster codes embedded as images | OCR processing required |

**Libraries Used:**

- **PyMuPDF** — PDF parsing and image extraction
- **Tesseract** — Optical Character Recognition (OCR)

**Output:** Structured JSON files containing all parsed poster data.

### Frontend

| Technology           | Purpose                                       |
| -------------------- | --------------------------------------------- |
| **Vue.js**           | Frontend framework                            |
| **Vite**             | Build tool and dev server                     |
| **Reactive Objects** | State management (no external store required) |

---

## 🔄 User Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE                                │
│              PDFs organized by categories                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SELECT PDF                                 │
│              Browse posters within a PDF                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ADD TO CART                                 │
│           Select posters and adjust quantities                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CONFIGURE ORDER                                │
│             Choose size and material options                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ADD TO CHECKOUT                                │
│      Creates an order batch (multiple batches supported)        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GENERATE PDF                                  │
│         Download order PDF for dealer submission                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
poster-catalogue-app/
├── 📂 pdf-parsing/          # Python scripts for PDF processing
├── 📂 frontend/             # Vue.js application
└── 📂 data/                 # Generated JSON catalogue data
```

---

## 🚀 Getting Started

_Documentation coming soon_

---

## 📄 License

_License information to be added_
