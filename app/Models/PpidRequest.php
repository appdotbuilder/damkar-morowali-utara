<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PpidRequest
 *
 * @property int $id
 * @property string $request_number
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string $address
 * @property string $identity_type
 * @property string $identity_number
 * @property string $information_requested
 * @property string $purpose
 * @property string|null $identity_document
 * @property string $status
 * @property string|null $response
 * @property array|null $response_documents
 * @property \Illuminate\Support\Carbon|null $responded_at
 * @property int|null $processed_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\User|null $processedBy
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereIdentityDocument($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereIdentityNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereIdentityType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereInformationRequested($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereProcessedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest wherePurpose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereRequestNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereRespondedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereResponseDocuments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PpidRequest whereUpdatedAt($value)
 * @method static \Database\Factories\PpidRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class PpidRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'request_number',
        'name',
        'email',
        'phone',
        'address',
        'identity_type',
        'identity_number',
        'information_requested',
        'purpose',
        'identity_document',
        'status',
        'response',
        'response_documents',
        'responded_at',
        'processed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'response_documents' => 'array',
        'responded_at' => 'datetime',
    ];

    /**
     * Get the user who processed this PPID request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Generate a unique request number.
     *
     * @return string
     */
    public static function generateRequestNumber(): string
    {
        $date = now()->format('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        return "PPID{$date}" . str_pad((string)$count, 4, '0', STR_PAD_LEFT);
    }
}