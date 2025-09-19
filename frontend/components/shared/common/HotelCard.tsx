
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const HotelCard = ({ hotel, onSelect, isSelected }) => (
    <Card className={`transition-all ${isSelected ? 'border-primary' : ''}`}>
        <CardHeader>
            <CardTitle>{hotel.name}</CardTitle>
            <CardDescription>{hotel.location}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-lg font-semibold">${hotel.price} / night</p>
        </CardContent>
        <CardFooter>
            <Button onClick={() => onSelect(hotel)} className="w-full" variant={isSelected ? 'default' : 'outline'}>
                {isSelected ? 'Selected' : 'Select'}
            </Button>
        </CardFooter>
    </Card>
);

export default HotelCard;
