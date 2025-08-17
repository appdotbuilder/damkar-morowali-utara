<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\FireStation
 *
 * @property int $id
 * @property string $name
 * @property string $address
 * @property string $district
 * @property string|null $phone
 * @property string|null $latitude
 * @property string|null $longitude
 * @property array|null $equipment
 * @property int $personnel_count
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation query()
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereDistrict($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereEquipment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation wherePersonnelCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FireStation active()
 * @method static \Database\Factories\FireStationFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class FireStation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'address',
        'district',
        'phone',
        'latitude',
        'longitude',
        'equipment',
        'personnel_count',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'equipment' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Scope a query to only include active fire stations.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}