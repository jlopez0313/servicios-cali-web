// resources/js/Components/StarRating.jsx
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({
    readOnly=false,
    initialRating = 0,
    onRatingChange,
    size = 24,
    color = 'currentColor',
    activeColor = '#fbbf24', // amber-400
    resetKey,
    allowHalfStars = false,
}: any) {

    const [rating, setRating] = useState<number>(initialRating);
    const [hover, setHover] = useState<number>(0);
    const [tempRating, setTempRating] = useState(0);

    const handleClick = (newRating: number) => {
        setRating(newRating);
        if (onRatingChange) {
            onRatingChange(newRating);
        }
    };

    const handleMouseEnter = (starIndex: number) => {
        setHover(starIndex);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hover || rating);
                const isActive = star === (hover || rating);

                return (
                    <button
                        key={star}
                        type="button"
                        className="p-1 focus:outline-none"
                        onClick={() => readOnly ? null : handleClick(star)}
                        onMouseEnter={() => readOnly ? null : handleMouseEnter(star)}
                        onMouseLeave={() => readOnly ? null : handleMouseLeave()}
                        aria-label={`Rate ${star} out of 5`}
                    >
                        <Star
                            size={size}
                            fill={isFilled ? activeColor : 'transparent'}
                            stroke={isFilled ? activeColor : color}
                            className="transition-colors duration-150"
                        />
                    </button>
                );
            })}
        </div>
    );
}