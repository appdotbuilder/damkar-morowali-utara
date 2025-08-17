<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|in:edukasi,rekomendasi,konsultasi,pengaduan',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'organization' => 'nullable|string|max:255',
            'description' => 'required|string|max:2000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Jenis layanan harus dipilih.',
            'type.in' => 'Jenis layanan tidak valid.',
            'name.required' => 'Nama pemohon harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'Nomor telepon harus diisi.',
            'description.required' => 'Deskripsi permohonan harus diisi.',
            'description.max' => 'Deskripsi tidak boleh lebih dari 2000 karakter.',
            'attachments.*.file' => 'File lampiran tidak valid.',
            'attachments.*.mimes' => 'File lampiran harus berformat PDF, JPG, JPEG, atau PNG.',
            'attachments.*.max' => 'Ukuran file lampiran maksimal 5MB.',
        ];
    }
}