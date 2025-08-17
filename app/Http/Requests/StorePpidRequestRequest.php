<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePpidRequestRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'identity_type' => 'required|in:KTP,SIM,Passport',
            'identity_number' => 'required|string|max:50',
            'information_requested' => 'required|string|max:1000',
            'purpose' => 'required|string|max:500',
            'identity_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048', // 2MB max
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
            'name.required' => 'Nama pemohon harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'Nomor telepon harus diisi.',
            'address.required' => 'Alamat harus diisi.',
            'identity_type.required' => 'Jenis identitas harus dipilih.',
            'identity_type.in' => 'Jenis identitas tidak valid.',
            'identity_number.required' => 'Nomor identitas harus diisi.',
            'information_requested.required' => 'Informasi yang diminta harus diisi.',
            'information_requested.max' => 'Informasi yang diminta tidak boleh lebih dari 1000 karakter.',
            'purpose.required' => 'Tujuan penggunaan informasi harus diisi.',
            'purpose.max' => 'Tujuan penggunaan tidak boleh lebih dari 500 karakter.',
            'identity_document.required' => 'Dokumen identitas harus dilampirkan.',
            'identity_document.file' => 'Dokumen identitas tidak valid.',
            'identity_document.mimes' => 'Dokumen identitas harus berformat PDF, JPG, JPEG, atau PNG.',
            'identity_document.max' => 'Ukuran dokumen identitas maksimal 2MB.',
        ];
    }
}