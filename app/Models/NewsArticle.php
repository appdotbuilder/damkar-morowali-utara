<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\NewsArticle
 *
 * @property int $id
 * @property string $title
 * @property string|null $summary
 * @property string $content
 * @property string|null $author
 * @property string|null $cover_image
 * @property string $category
 * @property array|null $tags
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle query()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereAuthor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereCoverImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereSummary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereTags($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsArticle published()
 * @method static \Database\Factories\NewsArticleFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class NewsArticle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'summary',
        'content',
        'author',
        'cover_image',
        'category',
        'tags',
        'status',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    /**
     * Scope a query to only include published articles.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }
}