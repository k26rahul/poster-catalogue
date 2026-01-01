Schema of the metadata file "frontend\public\pdfs-data\metadata.json"

```json
{
  "pdfs": [
    {
      "id": "<pdf_id>",
      "path": "<original pdf file path>",
      "category": "<category name>",
      "total_posters": <number>,
      "thumbnail": "<image file name>"
    },
    ...
  ],
  "categories": [
    {
      "name": "<category name>",
      "description": "Beautiful posters of <category name>"
    },
    ...
  ]
}

```

Schema of the individual PDF data files (e.g. frontend\public\pdfs-data\01_Radha_Krishna_Art_Poster.json)

```json
{
  "id": "<pdf_id>",
  "path": "<original pdf file path>",
  "category": "<category name>",
  "total_posters": <number>,
  "thumbnail": "<image file name>",
  "posters": [
    {
      "page_no": <number>,
      "code": "<poster code>",
      "image_file": "<image file name>"
    },
    ...
  ]
}

```

Poster images are available in "frontend\public\poster-images"
