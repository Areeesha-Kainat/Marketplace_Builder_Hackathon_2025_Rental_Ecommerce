'use client';

import { FaHeart, FaRegHeart } from "react-icons/fa"; // Heart icons
import { GiCarDoor } from "react-icons/gi"; // Fuel icon
import { BiCog } from "react-icons/bi"; // Transmission icon
import { FaUsers } from "react-icons/fa"; // Seats icon
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { fetchCarsQuery } from "@/sanity/queries";
import Link from "next/link";
import { useState, useEffect } from "react";

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
};

export default function FetchCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByPrice, setFilterByPrice] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<Car[]>([]);

  // Fetch cars data
  useEffect(() => {
    const fetchData = async () => {
      const fetchedCars: Car[] = await client.fetch(fetchCarsQuery);
      setCars(fetchedCars);
    };
    fetchData();
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const toggleWishlist = (car: Car) => {
    let updatedWishlist = [...wishlist];
    const isCarInWishlist = wishlist.some((item) => item._id === car._id);

    if (isCarInWishlist) {
      updatedWishlist = updatedWishlist.filter((item) => item._id !== car._id);
    } else {
      updatedWishlist.push(car);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  const isCarInWishlist = (car: Car) =>
    wishlist.some((item) => item._id === car._id);

  // Filter and search functionality
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = filterByPrice ? car.pricePerDay <= filterByPrice : true;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar and Price Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Search cars by name or type..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
         
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="Filter by max price..."
              className="px-4 py-2 border border-gray-300 rounded-lg w-40"
              value={filterByPrice || ""}
              onChange={(e) =>
                setFilterByPrice(e.target.value ? parseInt(e.target.value, 10) : null)
              }
            />
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => setFilterByPrice(null)}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Popular Cars Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Cars</h2>
          <Link href="/category" className="text-blue-600 hover:underline">
  View All
</Link>

        </div>

        {/* Filtered Cars Section */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {filteredCars.slice(0, 4).map((car) => (
            <div
              key={car._id}
              className="bg-white shadow-md rounded-lg p-6 relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <button onClick={() => toggleWishlist(car)}>
                  {isCarInWishlist(car) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500">{car.type}</p>
              </div>

              {/* Image */}
              <div className="mt-4 mb-4 flex justify-center relative">
                <Image
                  src={car.imageUrl}
                  alt={car.name}
                  width={232}
                  height={128}
                  className="w-auto h-auto object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex items-center text-gray-500 text-sm mt-6 space-x-4">
                <div className="flex items-center space-x-1">
                  <GiCarDoor className="w-4 h-4 text-gray-500" />
                  <p>{car.fuelCapacity}L</p>
                </div>
                <div className="flex items-center space-x-1">
                  <BiCog className="w-4 h-4 text-gray-500" />
                  <p>{car.transmission}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <FaUsers className="w-4 h-4 text-gray-500" />
                  <p>{car.seatingCapacity} people</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">
                  ${car.pricePerDay}.00{" "}
                  <span className="text-gray-400 text-[14px]">/day</span>
                </p>
                <Link href={`/car/${car._id}`}>
  <button className="bg-blue-700 text-white px-4 py-2 text-sm rounded-md">
    Rent Now
  </button>
</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Cars Section */}
        <h2 className="text-2xl font-bold mt-10">Recommended Cars</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {filteredCars.slice(4).map((car) => (
            <div
              key={car._id}
              className="bg-white shadow-md rounded-lg p-6 relative"
            >
              {/* Same card structure as above */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <button onClick={() => toggleWishlist(car)}>
                  {isCarInWishlist(car) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500">{car.type}</p>
              </div>

              {/* Image */}
              <div className="mt-4 mb-4 flex justify-center relative">
                <Image
                  src={car.imageUrl}
                  alt={car.name}
                  width={232}
                  height={128}
                  className="w-auto h-auto object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex items-center text-gray-500 text-sm mt-6 space-x-4">
                <div className="flex items-center space-x-1">
                  <GiCarDoor className="w-4 h-4 text-gray-500" />
                  <p>{car.fuelCapacity}L</p>
                </div>
                <div className="flex items-center space-x-1">
                  <BiCog className="w-4 h-4 text-gray-500" />
                  <p>{car.transmission}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <FaUsers className="w-4 h-4 text-gray-500" />
                  <p>{car.seatingCapacity} people</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">
                  ${car.pricePerDay}.00{" "}
                  <span className="text-gray-400 text-[14px]">/day</span>
                </p>
                <Link href={`/car/${car._id}`}>
  <button className="bg-blue-700 text-white px-4 py-2 text-sm rounded-md">
    Rent Now
  </button>
</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/category">
             <button className="bg-blue-700 text-white px-4 py-2 rounded-md">
               Show More Cars
             </button>
           </Link>
         </div>
      </div>
    </div>
  );
}





