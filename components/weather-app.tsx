"use client";
import { useState, ChangeEvent, FormEvent, use } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Weatherdata{
    temperature : number,     
    unit : string,
    location : string,
    description : string
}

export default function WeatherApp(){
    const[location, setLocation] = useState<string>("");
    const[weather, setWeather] = useState<Weatherdata | null>(null);
    const[error, setError] = useState<string | null>(null);
    const[isloading, setIsLoading] = useState<boolean>(false);

    const HandlingSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const TrimmedLocation = location.trim();
        if (TrimmedLocation === ""){
            setError("Please enter a valid location and try again!")
            setWeather(null)
            return;
        }
        setIsLoading(true);
        setError(null);

        try{

            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${TrimmedLocation}`
            )
            if(!response.ok){
                throw new Error("City not found. Please try again");
            }
            const Data = await response.json();

            const weatherData : Weatherdata = {
                temperature : Data.current.temp_c,
                description : Data.current.condition.text,
                location : Data.location.name,
                unit : "C",


            };
            setWeather(weatherData);
        }
            catch(error){
                setError("City not found. Please enter a valid city and try again");
                setWeather(null);
            }
                finally{
                    setIsLoading(false);

                }
        
        
    };
    
    function getTemperature(temperature : number, unit: string){
        if(unit == "C" ) {
            if(temperature < 0){
                return `Its freezing at ${temperature}℃. Be near your fireplace at all time!`
            }
            else if(temperature < 10){
                return `Its pretty cold out there, at ${temperature}℃. Unpack your warm clothes!`
            }
             else if(temperature < 20){
                return `The temperature is ${temperature}℃. A light jacket will do.`
            }
            else if(temperature < 30){
                return `The temperature is ${temperature}℃. Its summer time!`
            }
            else if(temperature < 40){
                return `Its hot at ${temperature}℃. Stay hydrated!`
            }
        }
        else {
            return `${temperature}°${unit}.`
        }  
            

    }
    function getWeatherMessage(description : string) : string {
        switch (description.toLocaleLowerCase()){
            case "sunny":
                return " The weather is perfect for going to the beach!"
            case "partly cloudy":
                return "Expect some clouds and sunshine."
                case "cloudy":
                    return "Its cloudy today."
                    case "overcast":
                        return "Its an overcast. Be prepared! "
                        case "rain":
                            return "Its raining. Be careful and don't forget your umbrellas!"
                            case "thunderstorm":
                                return "Thunderstorms are expected today. Stay in and close your windows!"
                                case "snow":
                                    return "Its snowing! Follow all the neccesary precautions to avoid accidents."
                                    case "snow":
                                        return "Its snowing! Follow all the neccesary precautions to avoid accidents."
                                        case "mist":
                                            return "Its misty outside."
                                            case "fog":
                                                return "Be careful of the fog."
                                                default:
                                                    return description                     
        }
     
    }
    function getLocationMessage(location : string) : string{
        const currentHour = new Date().getHours()
        const isNight = currentHour >= 18 || currentHour < 6;
        return `Its ${isNight ? "night in" : "day in"}  ${location}`
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-auto max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>Check weather of your city.</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={HandlingSearch} className="flex items-center gap-2">
                    <Input type="text" placeholder="Enter your location" value = {location} onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button type="submit" disabled={isloading}>
                        {isloading? "Loading..." : "Search"} 

                    </Button>

                </form>
                {error && <div className="mt-4 text-red-300">{error}</div>}
                {weather && (
                    <div className="mt-4 grid gap-4">
                        <div className="flex ietms-center">
                            <ThermometerIcon className="w-6 h-6"/>
                            {getTemperature(weather.temperature, weather.unit)}
                        </div>
                        <div className="flex ietms-center gap-2">
                            <CloudIcon className="w-6 h-6"/>
                            {getWeatherMessage(weather.description)}
                        </div>
                        <div className="flex ietms-center gap-2">
                            <MapPinIcon className="w-6 h-6"/>
                            {getLocationMessage(weather.location)}
                        </div>

                    </div>
                )}
                    </CardContent>
            </Card>

        </div>
    )
}