
const getDataLocation = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'LastBiteApp/1.0 (herianto9671@gmail.com)',
        }
      }
    );
    const data = await response.json();

    if (!data || !data.address) {
      console.error("Alamat tidak ditemukan dari koordinat");
      return;
    }

    // const address = data.display_name;

    // const kelurahan = address.neighbourhood || address.village || address.hamlet || 'Kelurahan tidak ditemukan';
    // const kecamatan = address.suburb || address.city_district || 'Kecamatan tidak ditemukan';

    return { 
      address: data.address.neighbourhood || data.address.village || data.address.hamlet || data.display_name || 'tidak ada data lokasi',
    }
  } catch (error) {
    console.error("Gagal mendapatkan data lokasi:", error);
    return null;
  }
};

export default getDataLocation;