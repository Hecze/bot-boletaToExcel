import cv2
import pytesseract
import pandas as pd
from datetime import datetime

# Configuración de pytesseract
# Si pytesseract no está en el PATH, especifica la ruta completa a tesseract.exe
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def tomar_foto():
    # Inicia la cámara
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("No se puede acceder a la cámara")
        return None

    print("Presiona 's' para tomar una foto")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("No se puede recibir la imagen")
            break
        
        cv2.imshow('frame', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('s'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
    # Guarda la foto
    foto_nombre = 'foto_capturada.png'
    cv2.imwrite(foto_nombre, frame)
    
    return foto_nombre

def extraer_texto(imagen_path):
    # Leer la imagen usando OpenCV
    imagen = cv2.imread(imagen_path)
    
    # Usar pytesseract para extraer el texto
    texto = pytesseract.image_to_string(imagen, lang='spa')
    
    return texto

def guardar_en_excel(texto, archivo_excel):
    # Crear un DataFrame de pandas
    data = {'Texto': [texto]}
    df = pd.DataFrame(data)
    
    # Guardar en Excel
    with pd.ExcelWriter(archivo_excel, engine='openpyxl', mode='w') as writer:
        df.to_excel(writer, index=False)

def main():
    imagen_path = "/boleta.jpeg"
    if imagen_path:
        texto = extraer_texto(imagen_path)
        if texto:
            # Nombre del archivo Excel con la fecha actual
            archivo_excel = f'texto_extraido_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
            guardar_en_excel(texto, archivo_excel)
            print(f'Texto extraído y guardado en {archivo_excel}')
        else:
            print('No se pudo extraer texto de la imagen')
    else:
        print('No se pudo tomar la foto')

if __name__ == "__main__":
    main()
