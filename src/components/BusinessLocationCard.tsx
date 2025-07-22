import type { JSX } from "react";
import type { BusinessLocation } from "../models/BusinessLocation";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

interface Props {
  location: BusinessLocation;
}

export default function BusinessLocationCard({ location }: Props): JSX.Element {
  const hoursLines = location.hours.split("\n");

  return (
    <div className="bg-gray-50 rounded-xl p-8">
      {/* <h3 className="text-2xl font-semibold text-gray-900 mb-6">{location.name} Location</h3> */}

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Address</p>
            <p className="text-gray-600 mt-1">{location.address}</p>
          </div>
        </div>

        {location.phone ? (
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-gray-600 mt-1">{location.phone}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {location.email ? (
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600 mt-1">{location.email}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="flex items-start space-x-4">
          <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Hours</p>
            <ul className="flex flex-col gap-1">
              {hoursLines.map((it, i) => (
                <li key={`${i}-${it}`} className="text-gray-600">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
