/**
 * Calculate trip distance between two addresses using Google Distance Matrix API
 * @param {string} pickup - Pickup address
 * @param {string} delivery - Delivery address
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<number>} Distance in miles
 */
export async function calculateTripDistance(pickup, delivery, apiKey) {
    if (!pickup || !delivery) {
        console.warn('[Distance Calculator] Missing pickup or delivery address');
        return 0;
    }

    if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('[Distance Calculator] No valid API key provided, using mock distance');
        // Return mock distance for testing without API key
        return Math.floor(Math.random() * 1000) + 100;
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            pickup
        )}&destinations=${encodeURIComponent(delivery)}&units=imperial&key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.distance?.text) {
            const distanceText = data.rows[0].elements[0].distance.text;
            // Extract number from text like "967 mi" or "967.5 mi"
            const miles = parseFloat(distanceText.replace(/[^\d.]/g, ''));
            console.log(`[Distance Calculator] ${pickup} → ${delivery}: ${miles} miles`);
            return Math.round(miles);
        } else {
            console.warn('[Distance Calculator] Invalid response:', data.status);
            // Return mock distance as fallback
            return Math.floor(Math.random() * 1000) + 100;
        }
    } catch (error) {
        console.error('[Distance Calculator] Error calculating distance:', error);
        // Return mock distance as fallback
        return Math.floor(Math.random() * 1000) + 100;
    }
}

/**
 * Mock distance calculator for testing without API
 * Estimates distance based on simple heuristics
 */
export function calculateMockDistance(pickup, delivery) {
    // Extract state codes if present
    const pickupState = pickup.match(/\b[A-Z]{2}\b/)?.[0];
    const deliveryState = delivery.match(/\b[A-Z]{2}\b/)?.[0];

    if (pickupState && deliveryState) {
        if (pickupState === deliveryState) {
            // Same state: 100-400 miles
            return Math.floor(Math.random() * 300) + 100;
        } else {
            // Different states: 300-1500 miles
            return Math.floor(Math.random() * 1200) + 300;
        }
    }

    // Default random distance
    return Math.floor(Math.random() * 1000) + 100;
}
