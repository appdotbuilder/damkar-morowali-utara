import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

export default function PpidIndex() {
    return (
        <AppShell>
            <Head title="PPID - Pejabat Pengelola Informasi dan Dokumentasi" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                PPID
                            </h1>
                            <h2 className="text-2xl font-medium text-purple-600 mb-4">
                                Pejabat Pengelola Informasi dan Dokumentasi
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Dinas Pemadam Kebakaran Morowali Utara berkomitmen untuk keterbukaan informasi publik 
                                sesuai dengan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* What is PPID */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">❓ Apa itu PPID?</h3>
                                <div className="prose text-gray-600">
                                    <p className="mb-4">
                                        PPID adalah pejabat yang bertanggung jawab di bidang penyimpanan, pendokumentasian, 
                                        penyediaan, dan/atau pelayanan informasi di badan publik.
                                    </p>
                                    <p className="mb-4">
                                        Setiap badan publik wajib menunjuk PPID yang memiliki kompetensi di bidang 
                                        pengelolaan informasi dan dokumentasi serta memenuhi persyaratan sesuai dengan 
                                        peraturan perundang-undangan.
                                    </p>
                                </div>
                            </div>

                            {/* Types of Information */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Klasifikasi Informasi</h3>
                                
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-bold text-green-800 mb-2">✅ Informasi yang Wajib Disediakan dan Diumumkan</h4>
                                        <ul className="text-green-700 text-sm space-y-1">
                                            <li>• Informasi berkala (laporan keuangan, kinerja, dll)</li>
                                            <li>• Informasi serta merta (keadaan darurat, ancaman, dll)</li>
                                            <li>• Informasi setiap saat (daftar seluruh informasi publik)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-bold text-red-800 mb-2">❌ Informasi yang Dikecualikan</h4>
                                        <ul className="text-red-700 text-sm space-y-1">
                                            <li>• Informasi yang dapat mengganggu proses penegakan hukum</li>
                                            <li>• Informasi yang dapat mengganggu kepentingan perlindungan hak kekayaan intelektual</li>
                                            <li>• Informasi yang dapat membahayakan pertahanan dan keamanan negara</li>
                                            <li>• Informasi yang dapat mengungkapkan kekayaan alam Indonesia</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* How to Request */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 Cara Mengajukan Permohonan</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                                        <p className="text-gray-700">
                                            Isi formulir permohonan informasi dengan melengkapi identitas dan informasi yang diminta
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                                        <p className="text-gray-700">
                                            Lampirkan dokumen identitas (KTP/SIM/Passport)
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                                        <p className="text-gray-700">
                                            Submit permohonan dan dapatkan nomor register
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                                        <p className="text-gray-700">
                                            Tunggu respons dalam waktu maksimal 10 hari kerja
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">🚀 Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <Link href="/ppid/permohonan">
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                            📝 Ajukan Permohonan
                                        </Button>
                                    </Link>
                                    
                                    <Link href="/ppid/register">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            📊 Register Permohonan
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Contact PPID */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-purple-800 mb-3">📞 Kontak PPID</h3>
                                <div className="space-y-2 text-sm text-purple-700">
                                    <p><strong>PPID:</strong> Kasubbag Program</p>
                                    <p>📧 ppid@damkar-morowali.go.id</p>
                                    <p>📞 (0462) 123-456 ext. 201</p>
                                    <p>🏢 Kantor Dinas Pemadam Kebakaran</p>
                                    <p>📍 Jl. Pemadam No. 1, Kolonodale</p>
                                    <p>🕒 Senin - Jumat, 08:00 - 16:00 WITA</p>
                                </div>
                            </div>

                            {/* Legal Basis */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">⚖️ Dasar Hukum</h3>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <p>• UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</p>
                                    <p>• PP No. 61 Tahun 2010 tentang Pelaksanaan UU KIP</p>
                                    <p>• Peraturan Komisi Informasi No. 1 Tahun 2021</p>
                                    <p>• Perda Morowali Utara tentang PPID</p>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6">
                                <h3 className="text-lg font-bold mb-3">📈 Statistik PPID</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Permohonan Bulan Ini:</span>
                                        <span className="font-bold">12</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Rata-rata Respons:</span>
                                        <span className="font-bold">7 hari</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Tingkat Kepuasan:</span>
                                        <span className="font-bold">95%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}