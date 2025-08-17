import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface NewsArticle {
    id: number;
    title: string;
    summary?: string;
    published_at: string;
    category: string;
    cover_image?: string;
}

interface FireIncident {
    id: number;
    incident_number: string;
    incident_date: string;
    location: string;
    severity: string;
    status: string;
}

interface FireStation {
    id: number;
    name: string;
    district: string;
    phone?: string;
    status: string;
}

interface Statistics {
    total_incidents: number;
    incidents_this_month: number;
    active_stations: number;
    avg_response_time: number;
}

interface Props {
    canLogin?: boolean;
    canRegister?: boolean;
    latestNews: NewsArticle[];
    recentIncidents: FireIncident[];
    fireStations: FireStation[];
    statistics: Statistics;
    [key: string]: unknown;
}

export default function Welcome({ canLogin, canRegister, latestNews, recentIncidents, fireStations, statistics }: Props) {
    const emergencyCall = () => {
        window.location.href = 'tel:112';
    };

    const whatsappContact = () => {
        window.open('https://wa.me/628123456789', '_blank');
    };

    return (
        <>
            <Head title="Dinas Pemadam Kebakaran Morowali Utara" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
                {/* Header */}
                <header className="bg-white shadow-lg border-t-4 border-red-600">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">🚒</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">DAMKAR MOROWALI UTARA</h1>
                                    <p className="text-blue-600 font-medium">Dinas Pemadam Kebakaran</p>
                                </div>
                            </div>
                            
                            {/* Navigation */}
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">Beranda</Link>
                                <Link href="/berita" className="text-gray-700 hover:text-red-600 font-medium">Berita</Link>
                                <Link href="/layanan" className="text-gray-700 hover:text-red-600 font-medium">Layanan</Link>
                                <Link href="/ppid" className="text-gray-700 hover:text-red-600 font-medium">PPID</Link>
                                
                                {canLogin && (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login</Link>
                                        {canRegister && (
                                            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Daftar</Link>
                                        )}
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Emergency Alert Banner */}
                <div className="bg-red-600 text-white py-3">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center space-x-4 text-center">
                            <span className="text-2xl">🚨</span>
                            <p className="font-bold text-lg">DARURAT KEBAKARAN? HUBUNGI SEGERA!</p>
                            <div className="flex items-center space-x-2">
                                <Button 
                                    onClick={emergencyCall}
                                    className="bg-white text-red-600 hover:bg-red-50 font-bold px-6 py-2"
                                >
                                    📞 Telp. 112
                                </Button>
                                <Button 
                                    onClick={whatsappContact}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2"
                                >
                                    💬 WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-5xl font-bold mb-6">🔥 MELINDUNGI & MELAYANI 🔥</h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            Dinas Pemadam Kebakaran Morowali Utara berkomitmen memberikan perlindungan terbaik 
                            bagi masyarakat dari ancaman kebakaran dan bencana. Siap siaga 24/7 untuk keselamatan Anda.
                        </p>
                        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl mb-2">🚒</div>
                                <div className="text-2xl font-bold">{statistics.active_stations}</div>
                                <div className="text-sm">Pos Pemadam</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl mb-2">📊</div>
                                <div className="text-2xl font-bold">{statistics.incidents_this_month}</div>
                                <div className="text-sm">Kejadian Bulan Ini</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl mb-2">⏱️</div>
                                <div className="text-2xl font-bold">{Math.round(statistics.avg_response_time || 0)} min</div>
                                <div className="text-sm">Rata-rata Respons</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl mb-2">📈</div>
                                <div className="text-2xl font-bold">{statistics.total_incidents}</div>
                                <div className="text-sm">Total Penanganan</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-gray-800 mb-4">🛡️ Layanan Kami</h3>
                            <p className="text-xl text-gray-600">Berbagai layanan untuk keselamatan dan edukasi masyarakat</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-red-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">👨‍🏫</div>
                                <h4 className="text-xl font-bold text-red-600 mb-2">Edukasi & Simulasi</h4>
                                <p className="text-gray-600 mb-4">Pelatihan pencegahan kebakaran untuk sekolah dan komunitas</p>
                                <Link href="/layanan">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white">Ajukan Permohonan</Button>
                                </Link>
                            </div>
                            
                            <div className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">📋</div>
                                <h4 className="text-xl font-bold text-blue-600 mb-2">Rekomendasi Proteksi</h4>
                                <p className="text-gray-600 mb-4">Surat rekomendasi sistem proteksi kebakaran</p>
                                <Link href="/layanan">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ajukan Permohonan</Button>
                                </Link>
                            </div>
                            
                            <div className="bg-green-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">💬</div>
                                <h4 className="text-xl font-bold text-green-600 mb-2">Konsultasi</h4>
                                <p className="text-gray-600 mb-4">Konsultasi keselamatan kebakaran dan survei lapangan</p>
                                <Link href="/layanan">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">Konsultasi Sekarang</Button>
                                </Link>
                            </div>
                            
                            <div className="bg-purple-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">📝</div>
                                <h4 className="text-xl font-bold text-purple-600 mb-2">PPID</h4>
                                <p className="text-gray-600 mb-4">Permohonan keterbukaan informasi publik</p>
                                <Link href="/ppid">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Ajukan Permohonan</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest News */}
                {latestNews.length > 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold text-gray-800">📰 Berita Terbaru</h3>
                                <Link href="/berita" className="text-red-600 hover:text-red-800 font-medium">
                                    Lihat Semua Berita →
                                </Link>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {latestNews.slice(0, 6).map((article) => (
                                    <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                        <div className="h-48 bg-gradient-to-br from-red-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                                            <span className="text-6xl">📰</span>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs text-red-600 font-medium mb-2">{article.category.toUpperCase()}</div>
                                            <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h4>
                                            {article.summary && (
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(article.published_at).toLocaleDateString('id-ID')}
                                                </span>
                                                <Link href={`/berita/${article.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    Baca Selengkapnya →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Recent Incidents */}
                {recentIncidents.length > 0 && (
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-4">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8">🚨 Kejadian Terkini</h3>
                            <div className="space-y-4">
                                {recentIncidents.map((incident) => (
                                    <div key={incident.id} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{incident.location}</h4>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(incident.incident_date).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    incident.severity === 'ringan' ? 'bg-green-100 text-green-800' :
                                                    incident.severity === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                                                    incident.severity === 'berat' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {incident.severity.toUpperCase()}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">#{incident.incident_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Fire Stations */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-red-600 text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold mb-4">🏢 Pos Pemadam Kebakaran</h3>
                            <p className="text-xl opacity-90">Tersebar di seluruh wilayah untuk respon cepat</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fireStations.map((station) => (
                                <div key={station.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl">🚒</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            station.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                            {station.status === 'active' ? 'AKTIF' : 'NON-AKTIF'}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{station.name}</h4>
                                    <p className="text-sm opacity-90 mb-2">{station.district}</p>
                                    {station.phone && (
                                        <p className="text-sm font-medium">📞 {station.phone}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-xl font-bold mb-4">🚒 Damkar Morowali Utara</h4>
                                <p className="text-gray-300 mb-4">
                                    Melindungi dan melayani masyarakat Morowali Utara dengan dedikasi tinggi 
                                    dalam pencegahan dan penanggulangan kebakaran.
                                </p>
                                <div className="flex space-x-4">
                                    <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📞</span>
                                    <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</span>
                                    <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🌐</span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-bold mb-4">🔗 Tautan Cepat</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/berita" className="text-gray-300 hover:text-white transition-colors">Berita & Informasi</Link></li>
                                    <li><Link href="/layanan" className="text-gray-300 hover:text-white transition-colors">Layanan Publik</Link></li>
                                    <li><Link href="/ppid" className="text-gray-300 hover:text-white transition-colors">PPID</Link></li>
                                    <li><a href="tel:112" className="text-gray-300 hover:text-white transition-colors">Hubungi Darurat</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-bold mb-4">📍 Kontak</h4>
                                <div className="space-y-2 text-gray-300">
                                    <p>📧 damkar@morowalicut.go.id</p>
                                    <p>📞 (0462) 123-456</p>
                                    <p>💬 WhatsApp: 0812-3456-789</p>
                                    <p>🏢 Jl. Pemadam No. 1, Morowali Utara</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                            <p>&copy; 2024 Dinas Pemadam Kebakaran Morowali Utara. Hak cipta dilindungi.</p>
                            <p className="mt-2 text-sm">🚨 Untuk keadaan darurat, hubungi 112 atau 113 🚨</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}