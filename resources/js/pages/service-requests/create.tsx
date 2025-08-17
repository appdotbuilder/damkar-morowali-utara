import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

export default function CreateServiceRequest() {
    const { data, setData, post, processing, errors } = useForm({
        type: '',
        name: '',
        email: '',
        phone: '',
        organization: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('service-requests.store'));
    };

    return (
        <AppShell>
            <Head title="Permohonan Layanan - Damkar Morowali Utara" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">🛡️ Permohonan Layanan</h1>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Ajukan permohonan layanan edukasi, rekomendasi proteksi kebakaran, 
                                    konsultasi, atau pengaduan melalui formulir di bawah ini.
                                </p>
                            </div>
                        </div>

                        {/* Service Types Info */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                <div className="text-3xl mb-2">👨‍🏫</div>
                                <h3 className="font-bold text-red-600 mb-2">Edukasi & Simulasi</h3>
                                <p className="text-sm text-gray-600">Pelatihan pencegahan kebakaran untuk sekolah dan komunitas</p>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <div className="text-3xl mb-2">📋</div>
                                <h3 className="font-bold text-blue-600 mb-2">Rekomendasi Proteksi</h3>
                                <p className="text-sm text-gray-600">Surat rekomendasi sistem proteksi kebakaran</p>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <div className="text-3xl mb-2">💬</div>
                                <h3 className="font-bold text-green-600 mb-2">Konsultasi</h3>
                                <p className="text-sm text-gray-600">Konsultasi keselamatan kebakaran dan survei lapangan</p>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <div className="text-3xl mb-2">📢</div>
                                <h3 className="font-bold text-yellow-600 mb-2">Pengaduan</h3>
                                <p className="text-sm text-gray-600">Pengaduan terkait layanan atau kondisi keselamatan</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Service Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-red-600">*</span> Jenis Layanan
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih jenis layanan...</option>
                                        <option value="edukasi">🎓 Edukasi & Simulasi</option>
                                        <option value="rekomendasi">📋 Rekomendasi Proteksi Kebakaran</option>
                                        <option value="konsultasi">💬 Konsultasi & Survei</option>
                                        <option value="pengaduan">📢 Pengaduan</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                                </div>

                                {/* Personal Information */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="text-red-600">*</span> Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Masukkan nama lengkap"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="text-red-600">*</span> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="email@example.com"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="text-red-600">*</span> Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="0812-3456-7890"
                                            required
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organisasi/Instansi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.organization}
                                            onChange={(e) => setData('organization', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Nama perusahaan/sekolah/organisasi (opsional)"
                                        />
                                        {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-red-600">*</span> Deskripsi Permohonan
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Jelaskan detail permohonan Anda, termasuk lokasi, waktu yang diinginkan, jumlah peserta (untuk edukasi), atau informasi lain yang relevan..."
                                        required
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    <p className="text-gray-500 text-sm mt-1">Maksimal 2000 karakter</p>
                                </div>

                                {/* Submit Button */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="text-red-600">*</span> Wajib diisi
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Permohonan akan diproses dalam 1-3 hari kerja
                                            </p>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold px-8 py-3 text-lg disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>🔄 Memproses...</>
                                            ) : (
                                                <>📤 Kirim Permohonan</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                            <h3 className="font-bold text-blue-800 mb-3">ℹ️ Informasi Penting</h3>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li>• Semua permohonan akan mendapat nomor tiket untuk tracking</li>
                                <li>• Anda akan menerima konfirmasi melalui email yang didaftarkan</li>
                                <li>• Untuk layanan edukasi/simulasi, mohon ajukan minimal 1 minggu sebelum waktu yang diinginkan</li>
                                <li>• Rekomendasi proteksi kebakaran memerlukan survei lapangan terlebih dahulu</li>
                                <li>• Untuk pertanyaan, hubungi (0462) 123-456 atau WhatsApp 0812-3456-789</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}