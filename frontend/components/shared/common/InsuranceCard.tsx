import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const InsuranceCard = ({ insurance, onSelect, isSelected }) => (
    <Card className={`transition-all ${isSelected ? 'border-primary' : ''}`}>
        <CardHeader>
            <CardTitle>{insurance.name}</CardTitle>
            <CardDescription>{insurance.provider}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-lg font-semibold">${insurance.price}</p>
        </CardContent>
        <CardFooter>
            <Button onClick={() => onSelect(insurance)} className="w-full" variant={isSelected ? 'default' : 'outline'}>
                {isSelected ? 'Selected' : 'Select'}
            </Button>
        </CardFooter>
    </Card>
);

export default InsuranceCard;
