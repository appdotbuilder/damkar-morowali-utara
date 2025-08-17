import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface ServiceRequest {
    id: number;
    ticket_number: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    organization?: string;
    description: string;
    status: string;
    notes?: string;
    scheduled_at?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    serviceRequest: ServiceRequest;
    [key: string]: unknown;
}

export default function ShowServiceRequest({ serviceRequest }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'baru': return 'bg-blue-100 text-blue-800';
            case 'diproses': return 'bg-yellow-100 text-yellow-800';
            case 'diverifikasi': return 'bg-purple-100 text-purple-800';
            case 'selesai': return 'bg-green-100 text-green-800';
            case 'ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'edukasi': return '🎓 Edukasi & Simulasi';
            case 'rekomendasi': return '📋 Rekomendasi Proteksi';
            case 'konsultasi': return '💬 Konsultasi & Survei';
            case 'pengaduan': return '📢 Pengaduan';
            default: return type;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'baru': return '🆕 Baru';
            case 'diproses': return '⏳ Diproses';
            case 'diverifikasi': return '✅ Diverifikasi';
            case 'selesai': return '🎉 Selesai';
            case 'ditolak': return '❌ Ditolak';
            default: return status;
        }
    };

    return (
        <AppShell>
            <Head title={`Tiket ${serviceRequest.ticket_number} - Damkar Morowali Utara`} />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                ← Kembali ke Beranda
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎫</div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Tiket #{serviceRequest.ticket_number}
                                </h1>
                                <div className="flex items-center justify-center space-x-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(serviceRequest.status)}`}>
                                        {getStatusLabel(serviceRequest.status)}
                                    </span>
                                    <span className="text-gray-500">|</span>
                                    <span className="text-lg font-medium text-gray-700">
                                        {getTypeLabel(serviceRequest.type)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Request Details */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Detail Permohonan</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Pemohon</label>
                                            <p className="text-gray-800 font-medium">{serviceRequest.name}</p>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                                <p className="text-gray-800">{serviceRequest.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Telepon</label>
                                                <p className="text-gray-800">{serviceRequest.phone}</p>
                                            </div>
                                        </div>

                                        {serviceRequest.organization && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Organisasi</label>
                                                <p className="text-gray-800">{serviceRequest.organization}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                                            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                                                {serviceRequest.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule */}
                                {serviceRequest.scheduled_at && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-green-800 mb-2">📅 Jadwal Terjadwal</h3>
                                        <p className="text-green-700 font-medium">
                                            {new Date(serviceRequest.scheduled_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {serviceRequest.notes && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-blue-800 mb-2">💬 Catatan dari Petugas</h3>
                                        <div className="text-blue-700 whitespace-pre-wrap">
                                            {serviceRequest.notes}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Status Timeline */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Status Permohonan</h3>
                                    
                                    <div className="space-y-4">
                                        <div className={`flex items-center space-x-3 ${
                                            ['baru', 'diproses', 'diverifikasi', 'selesai'].includes(serviceRequest.status) ? 'opacity-100' : 'opacity-50'
                                        }`}>
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Permohonan Diterima</span>
                                        </div>
                                        
                                        <div className={`flex items-center space-x-3 ${
                                            ['diproses', 'diverifikasi', 'selesai'].includes(serviceRequest.status) ? 'opacity-100' : 'opacity-30'
                                        }`}>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Sedang Diproses</span>
                                        </div>
                                        
                                        <div className={`flex items-center space-x-3 ${
                                            ['diverifikasi', 'selesai'].includes(serviceRequest.status) ? 'opacity-100' : 'opacity-30'
                                        }`}>
                                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Diverifikasi</span>
                                        </div>
                                        
                                        <div className={`flex items-center space-x-3 ${
                                            serviceRequest.status === 'selesai' ? 'opacity-100' : 'opacity-30'
                                        }`}>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Selesai</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-red-800 mb-3">📞 Butuh Bantuan?</h3>
                                    <div className="space-y-2 text-sm text-red-700">
                                        <p>Hubungi kami jika ada pertanyaan:</p>
                                        <div className="space-y-1">
                                            <p>📞 (0462) 123-456</p>
                                            <p>💬 WhatsApp: 0812-3456-789</p>
                                            <p>📧 damkar@morowalicut.go.id</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                        <Button 
                                            onClick={() => window.open('https://wa.me/628123456789?text=Halo, saya ingin menanyakan status tiket ' + serviceRequest.ticket_number, '_blank')}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            💬 Chat WhatsApp
                                        </Button>
                                        <Button 
                                            onClick={() => window.location.href = 'tel:0462123456'}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            📞 Telepon
                                        </Button>
                                    </div>
                                </div>

                                {/* Request Info */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">ℹ️ Informasi Tiket</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dibuat:</span>
                                            <span className="font-medium">
                                                {new Date(serviceRequest.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Terakhir Update:</span>
                                            <span className="font-medium">
                                                {new Date(serviceRequest.updated_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nomor Tiket:</span>
                                            <span className="font-mono font-bold text-red-600">
                                                {serviceRequest.ticket_number}
                                            </span>
                                        </div>
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