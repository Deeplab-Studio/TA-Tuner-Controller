
# TA-Tuner-Controller

[Read in English](README_EN.md)

Bu proje, ESP32 ve step motor kullanarak değişken kapasitörleri (variable capacitor) WiFi üzerinden kontrol etmenizi sağlayan bir uzaktan tuner sistemidir.

## Özellikler

*  **WiFi Erişim Noktası (AP):** Cihaz kendi WiFi ağını ("TA-Tuner-Controller") oluşturur, böylece harici bir modeme ihtiyaç duymaz.

*  **Web Tabanlı Kontrol:** Herhangi bir tarayıcı (telefon, tablet veya PC) üzerinden erişilebilen kullanıcı dostu arayüz.

*  **Hassas Motor Kontrolü:** AccelStepper kütüphanesi kullanılarak step motorun hassas bir şekilde ileri/geri sürülmesi sağlanır.

*  **OTA Güncelleme:** Cihazın yazılımı kablosuz olarak (`/update` sayfası üzerinden) güncellenebilir.

## Donanım Gereksinimleri

*  **Mikrodenetleyici:** ESP32 (ESP32-DevKitC V1 vb.)

*  **Motor:** 28BYJ-48 (5V) Step Motor

*  **Sürücü:** ULN2003 Step Motor Sürücü Kartı

*  **Kapasitör:** MLA Anten için Uygun Değişken Kapasitör (Varyable)

*  **Güç Kaynağı:** ESP32 ve Motor için uygun güç kaynağı (örn. Powerbank veya USB adaptör)

## Bağlantı Şeması

Yazılımda tanımlanan pin bağlantıları şöyledir:

| ULN2003 Sürücü | ESP32 GPIO |
| :--- | :--- |
| IN1 | 19 |
| IN2 | 18 |
| IN3 | 5 |
| IN4 | 17 |
| + (5V - 12V) | VIN / 5V |
| - (GND) | GND |

>  **Not:** Motor dönüş yönü ters gelirse pin sıralamasını veya kod içerisindeki bağlantı sırasını değiştirebilirsiniz.

## Kurulum ve Kullanım

1.  **Yazılımı Yükleme:**

* Projeyi bilgisayarınıza indirin.

* Visual Studio Code üzerinde PlatformIO eklentisi ile projeyi açın.

* ESP32 kartınızı bağlayıp "Upload" butonuna basarak yazılımı yükleyin.


2.  **Bağlantı:**

* Cihaza güç verin.

* Bilgisayarınız veya telefonunuzdan WiFi ağlarını taratın.

*  `TA-Tuner-Controller` ağına bağlanın.

* Şifre: `deeplabstudio`

3.  **Kontrol:**

* Web tarayıcınızı açın ve adres çubuğuna `192.168.4.1` yazın.

* Açılan arayüzden motoru istediğiniz yöne ve adım sayısına göre hareket ettirerek anten ayarını yapın.

## Galeri

Aşağıda projenin 3D tasarımı ve örnek montaj görselleri yer almaktadır:

![Proje Görseli 1](images/img1.png)

![Proje Görseli 2](images/img2.png)

![Proje Görseli 3](images/img3.png)

![Proje Görseli 4](images/img4.png)
