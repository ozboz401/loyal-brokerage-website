import { useState, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin } from 'lucide-react';

export function AddressAutocomplete({ label, value, onChange, placeholder = "Start typing address...", required = false }) {
    const {
        ready,
        value: inputValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {
            componentRestrictions: { country: 'us' }, // Restrict to US addresses
        },
    });

    const [isFocused, setIsFocused] = useState(false);

    // Sync external value with internal input value
    useEffect(() => {
        if (value && value !== inputValue) {
            setValue(value, false);
        }
    }, [value]);

    const handleSelect = async (description) => {
        setValue(description, false);
        clearSuggestions();
        onChange(description);

        // Optionally get coordinates for future use
        try {
            const results = await getGeocode({ address: description });
            const { lat, lng } = await getLatLng(results[0]);
            console.log(`[Address Autocomplete] Selected: ${description} (${lat}, ${lng})`);
        } catch (error) {
            console.error('[Address Autocomplete] Error getting coordinates:', error);
        }
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
        // Propagate change to parent immediately for manual entry
        onChange(e.target.value);
    };

    const handleBlur = () => {
        // Delay to allow click on suggestion
        setTimeout(() => {
            setIsFocused(false);
            clearSuggestions();
        }, 200);
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-gray-400">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <MapPin size={18} />
                </div>
                <input
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    // Enable input even if API is not ready to allow manual entry
                    // disabled={!ready} 
                    autoComplete="off"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder={ready ? placeholder : "Enter address manually (Google Maps unavailable)"}
                />
                {status === "OK" && isFocused && (
                    <div className="absolute z-50 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-h-60 overflow-y-auto">
                        {data.map(({ place_id, description }) => (
                            <div
                                key={place_id}
                                onClick={() => handleSelect(description)}
                                className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-sm text-white border-b border-gray-700 last:border-b-0 transition-colors flex items-start gap-2"
                            >
                                <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                <span>{description}</span>
                            </div>
                        ))}
                    </div>
                )}
                {!ready && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
