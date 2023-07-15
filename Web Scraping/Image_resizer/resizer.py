from PIL import Image
import os

# Set the target size for the resized images
target_size = (300, 300)  # Adjust as per your requirement

# Define the path to the directory containing your images
image_dir = "/Users/nirajanpaudel17/Documents/Python/Major-Project/Web-Scrapping/images"

# Get a list of all image files in the directory
image_files = [file for file in os.listdir(image_dir) if file.endswith(('.jpg', '.jpeg', '.png'))]

# Iterate over each image file and resize it
for file in image_files:
    # Open the image file
    image_path = os.path.join(image_dir, file)
    image = Image.open(image_path)

    # Resize the image while maintaining the aspect ratio
    image.thumbnail(target_size, Image.ANTIALIAS)

    # Save the resized image, overwriting the original file
    image.save(image_path)

    # Print the original and resized dimensions for reference
    print(f"Resized {file}: Original Size: {image.size}, Resized Size: {target_size}")
