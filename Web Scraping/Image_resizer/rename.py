import os

# Define the path to the directory containing your images
image_dir = "/Users/nirajanpaudel17/Documents/Python/Major-Project/Web-Scrapping/images"

# Iterate over all the subdirectories in the image directory
for root, dirs, files in os.walk(image_dir):
    for dir_name in dirs:
        subdir = os.path.join(root, dir_name)

        # Get the list of image files in the subdirectory
        image_files = [file for file in os.listdir(subdir) if file.endswith(('.jpg', '.jpeg', '.png'))]

        # Rename the image files within the subdirectory
        for i, file in enumerate(image_files, start=1):
            original_path = os.path.join(subdir, file)
            new_filename = f"image{i}.jpg"  # Adjust the file extension if needed
            new_path = os.path.join(subdir, new_filename)

            # Rename the image file
            os.rename(original_path, new_path)

            # Print the original and new filenames for reference
            print(f"Renamed {file} to {new_filename}")
