'use client';

import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { fetchCarsQuery } from '@/sanity/queries';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Reviews from '@/components/Reviews';
import FetchCarsPage from '@/app/fetchcars/page';

type Car = {
  _id: string;
  name: string;
  brand: string;
  type: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: number;
  pricePerDay: number;
  originalPrice?: number;
  tags: string[];
  imageUrl: string;
  capacity?: string;
  favorite?: boolean;
};

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(100);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const fetchedCars: Car[] = await client.fetch(fetchCarsQuery);
        const selectedCar = fetchedCars.find((car) => car._id === params.id);
        setCar(selectedCar || null);
        setCars(fetchedCars);
        setFilteredCars(fetchedCars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCar();
  }, [params.id]);

  useEffect(() => {
    let filtered = cars;

    if (selectedType) {
      filtered = filtered.filter((car) => car.type === selectedType);
    }

    if (selectedCapacity) {
      const capacityMap: { [key: string]: number } = {
        "2 Person": 2,
        "4 Person": 4,
        "5 Person": 5,
        "6 Person": 6,
        "7 or More": 7,
      };
      filtered = filtered.filter((car) => car.seatingCapacity >= capacityMap[selectedCapacity!]);
    }

    filtered = filtered.filter((car) => car.pricePerDay <= price);

    setFilteredCars(filtered);
  }, [selectedType, selectedCapacity, price, cars]);

  if (!car) {
    return <div>Loading...</div>;
  }

  const types = [
    { name: "Sport", count: 10 },
    { name: "SUV", count: 12 },
    { name: "Gasoline", count: 16 },
    { name: "Sedan", count: 20 },
    { name: "Hybrid", count: 14 },
    { name: "Hatchback", count: 14 },
  ];

  const capacities = [
    { name: "2 Person", count: 10 },
    { name: "4 Person", count: 14 },
    { name: "5 Person", count: 8 },
    { name: "6 Person", count: 12 },
    { name: "7 or More", count: 16 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Section: Aside Filter Panel */}
        <aside className="w-full lg:w-[320px] max-h-[700px] overflow-y-auto p-4 bg-white shadow-lg rounded-lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3">Type</h2>
            <ul className="space-y-2">
              {types.map((type) => (
                <li
                  key={type.name}
                  className="flex justify-between items-center px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedType(type.name)}
                >
                  <span className="flex items-center text-base">{type.name}</span>
                  <span className="text-gray-400 text-sm">{type.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3">Capacity</h2>
            <ul className="space-y-2">
              {capacities.map((capacity) => (
                <li
                  key={capacity.name}
                  className="flex justify-between items-center px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedCapacity(capacity.name)}
                >
                  <span className="flex items-center text-base">{capacity.name}</span>
                  <span className="text-gray-400 text-sm">{capacity.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Price</h2>
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-0 left-0 h-2 rounded-lg bg-blue-500 pointer-events-none"
                style={{ width: `${(price / 500) * 100}%` }}
              ></div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Min: $0</span>
                <span>Max: ${price}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Section Container */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Blue Div */}
          <div className="bg-blue-600 text-white rounded-lg p-6 sm:p-8 h-auto md:h-[250px] flex flex-col md:flex-row items-center">
            <div className="w-full md:flex-1 mb-4 md:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Easy way to rent a car at a low price
              </h2>
              <p className="text-sm sm:text-base mb-4">
                Providing cheap car rental services and safe and comfortable facilities.
              </p>
              <button className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 rounded-md font-semibold whitespace-nowrap">
                Rental Car
              </button>
            </div>
            <div className="w-full md:flex-1 flex justify-center items-center">
              <Image
                src={car.imageUrl}
                alt={car.name}
                width={200}
                height={200}
                className="w-full max-w-[180px] sm:max-w-[200px] object-contain shadow-lg rounded-md"
              />
            </div>
          </div>

          {/* Three Small Images */}
          <div className="flex flex-wrap justify-center gap-4">
            <Image
              src={car.imageUrl}
              alt={`${car.name} - Main`}
              width={100}
              height={100}
              className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-md shadow-md"
            />
            <Image
              src="/View 2.png"
              alt={`${car.name} - View 1`}
              width={100}
              height={100}
              className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-md shadow-md"
            />
            <Image
              src="/View 3.png"
              alt={`${car.name} - View 2`}
              width={100}
              height={100}
              className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-md shadow-md"
            />
          </div>
        </div>

        {/* Right White Div */}
        <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4 sm:p-6 h-fit">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{car.name}</h3>
            <button>
              {car.favorite ? (
                <FaHeart className="w-6 h-6 text-red-500" />
              ) : (
                <FaRegHeart className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-1">440+ Reviewers</p>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className="w-5 h-5 text-yellow-400" />
            ))}
          </div>

          <p className="text-gray-600 mb-2 text-sm">
            NISMO has become the embodiment of {car.name}'s outstanding performance, inspired by the most unforgiving proving ground, the “race track.”
          </p>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <div className="flex w-full justify-between">
                <strong>Type:</strong> 
                <span>{car.type}</span>
                <strong className="ml-14">Capacity:</strong> 
                <span>{car.seatingCapacity}</span>
              </div>
            </li>
            <li className="flex justify-between">
              <div className="flex w-full justify-between">
                <strong>Seats:</strong> 
                <span>{car.seatingCapacity}</span>
                <strong className="ml-8">Transmission:</strong> 
                <span>{car.transmission}</span>
              </div>
            </li>
          </ul>

          <div className="mt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${car.pricePerDay.toFixed(2)}</span>
                <span className="line-through text-gray-400 ml-2 text-sm">${car.originalPrice || 'N/A'}</span>
              </div>
              <Link href={`/payment/${car._id}`}>
                <button className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded-md font-semibold text-sm">
                  Rent Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Reviews Section */}
      <div className="max-w-7xl mx-auto mt-4 w-full px-4 sm:px-6">
        <Reviews />
      </div>

      <FetchCarsPage />
    </div>
  );
}

