<?php

namespace App\Services;

use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;

class ImageCompressionService
{
    /**
     * Comprime un archivo de imagen con  baja tasa de bits.
     *
     * @param any $imagePath ruta archivo local.
     * @param string $savePath Ruta de almacenamiento.
     * @return string|null URL pública del archivo comprimido o null si falla.
     */
    public function compressImageFromPath(string $imagePath, string $savePath)
    {
        $sizeInBytes = filesize($imagePath);
        $sizeInKB = round($sizeInBytes / 1024, 2);

        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
        $filename = uniqid() . '_compressed.' . $extension;
        $fullPath = storage_path("{$savePath}{$filename}");

        if ( $sizeInKB > 800 ) {
            $manager = ImageManager::gd();
            $resizedImage = $manager->read($imagePath)
                ->scale(width: 800);            
    
            $resizedImage->save($fullPath, 80, $extension);
            return explode('/', $savePath)[1] . '/' . $filename;
        }

        return null;
    }

    /**
     * Comprime un archivo de imagen con  baja tasa de bits.
     *
     * @param any $imagen Archivo uploaded.
     * @param string $path Ruta de almacenamiento.
     * @return string|null URL pública del archivo comprimido o null si falla.
     */
    public function compressImage($image, $path) 
    {

        $extension = $image->getClientOriginalExtension();
        $filename = uniqid() . '_compressed.' . $extension;
        $fullPath = storage_path("{$path}{$filename}");
        $sizeInKB = $image->getSize() / 1024;

        if ( $sizeInKB > 800 ) {
            $manager = ImageManager::gd();
            $resizedImage = $manager->read($image->getRealPath())
                ->scale(width: 800);

            $resizedImage->save($fullPath, 80, $extension);
        } else {
            $image->move(storage_path($path), $filename);
        }

        return explode('/', $path)[1] . '/' . $filename;
    }

     /**
     * Comprime un archivo de imagen con  baja tasa de bits.
     *
     * @param any $base64Str Archivo en base64.
     * @param string $path Ruta de almacenamiento.
     * @return string|null URL pública del archivo comprimido o null si falla.
     */
    public function compressBase64($image_64, $path) 
    {
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];
        $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);

        $imageBinary = base64_decode($image);
        $sizeInKB = strlen($imageBinary) / 1024;
        
        $filename = uniqid() . '_compressed.' . $extension;
        $fullPath = storage_path("{$path}/{$filename}");

        if ($sizeInKB > 800) {
        
            $manager = ImageManager::gd();
            $resizedImage = $manager->read( $imageBinary )
                ->scale(width: 800);

            $resizedImage->save($fullPath, 80, $extension);
        } else {
            file_put_contents($fullPath, $imageBinary);
        }

        return explode('/', $path)[1] . '/' . $filename;
    }

}