Poster Catalog app

The problem that I am solving:

My father has a shop. He sells posters and photo frames. He has to order the posters from the dealer. The dealer provides my father a lot of PDFs. The PDF contains the poster images and their code. My father has to write down on paper every postal code that he's going to order.

It's a lot of manual effort. There is lot of chances of mistakes. Because he's writing using pen and paper: He cannot modify easily his order list. He has to keep track of the posters that he has ordered and the posters that he has not ordered. He has to write down the poster code on the paper. But he cannot write down the images. While looking at the codes he is not able to identify how the poster look like. A lot of time he need to change the order list.

That's why I wanted to digitize everything.

I wanted a digital postal catalog system that can help him to order the posters easily. The system should be able to show the poster images and their codes. He should be able to select the posters that he wants to order. He should be able to modify his order list easily. He should be able to see the posters that he has ordered and the posters that he has not ordered.

The first challenge is to parse the PDF data.

For this I have to categorize PDF into three categories:

1. Those having single poster image per PDF page.
2. Those having multiple poster images per PDF page.
3. Those having poster code as image. I have to do the OCR on it.

For PDF parsing I have used the PyMuPDF library.

For OCR I have used the Tesseract library.

Goal is to generate the complete structural Json for all the PDFs.

When this is done, I started working on the front end.

I am using vue JS for front end. Using the vite build tool.

I am not using any stores. Built in reactive objects are enough for data storage.

The workflow:

- On the homepage, PDFS are arranged as categories.
- every category has some PDFS under it.
- Select on a PDF to browse the posters under it.
- Select any poster and adjust the quantity for purchase.
- Browse other other PDFs and finalize cart data.
- Select the size and material and proceed to checkout.
- This will add an order batch to your checkout.
- Select more posters then add again to checkout from cart.
- Can have multiple batches for checkout.
- When to finally commit, generate the PDF for the order.
- Downloaded PDF can be sent to dealer.
