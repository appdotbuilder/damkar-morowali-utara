<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ServiceRequest
 *
 * @property int $id
 * @property string $ticket_number
 * @property string $type
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string|null $organization
 * @property string $description
 * @property array|null $attachments
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $scheduled_at
 * @property int|null $assigned_to
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\User|null $assignedTo
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereAttachments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereOrganization($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereScheduledAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereTicketNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceRequest whereUpdatedAt($value)
 * @method static \Database\Factories\ServiceRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class ServiceRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_number',
        'type',
        'name',
        'email',
        'phone',
        'organization',
        'description',
        'attachments',
        'status',
        'notes',
        'scheduled_at',
        'assigned_to',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'attachments' => 'array',
        'scheduled_at' => 'datetime',
    ];

    /**
     * Get the user assigned to this service request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Generate a unique ticket number.
     *
     * @return string
     */
    public static function generateTicketNumber(): string
    {
        $date = now()->format('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        return "DMK{$date}" . str_pad((string)$count, 4, '0', STR_PAD_LEFT);
    }
}