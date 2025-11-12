import fitz  # PyMuPDF
import matplotlib.pyplot as plt

def show_pdf_page(pdf_path, page_num=0):
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_num)
    pix = page.get_pixmap()
    plt.imshow(pix.pil_tobytes())
    plt.axis('off')
    plt.show()

if __name__ == "__main__":
    show_pdf_page("Drawings_PDF/平面図.pdf")  # sample.pdfを同じフォルダに置いてください
