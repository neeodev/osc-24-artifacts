export function damageDeal(attack: number, damage: number, resistance: number){
    return (attack * (damage * 0.01)) * (resistance * 0.01);
} 

export function blockRate(resistance: number){
    return resistance/10;
}