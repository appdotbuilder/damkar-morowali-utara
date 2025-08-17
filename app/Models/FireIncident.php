<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\FireIncident
 *
 * @property int $id
 * @property string $incident_number
 * @property \Illuminate\Support\Carbon $incident_date
 * @property string $location
 * @property string|null $district
 * @property string|null $cause
 * @property string $severity
 * @property int|null $response_time_minutes
 * @property string|null $estimated_damage
 * @property int $casualties
 * @property int $injured
 * @property string|null $description
 * @property array|null $units_deployed
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident query()
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereCasualties($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereCause($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereDistrict($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereEstimatedDamage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereIncidentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereIncidentNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereInjured($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereResponseTimeMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereSeverity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereUnitsDeployed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireIncident whereUpdatedAt($value)
 * @method static \Database\Factories\FireIncidentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class FireIncident extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'incident_number',
        'incident_date',
        'location',
        'district',
        'cause',
        'severity',
        'response_time_minutes',
        'estimated_damage',
        'casualties',
        'injured',
        'description',
        'units_deployed',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'incident_date' => 'datetime',
        'units_deployed' => 'array',
        'estimated_damage' => 'decimal:2',
    ];
}