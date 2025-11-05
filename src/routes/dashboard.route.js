import { Router } from 'express';
import Donation from '../models/donation.model.js';
import Volunteer from '../models/volunteer.model.js';
import Contact from '../models/contact.model.js';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get aggregated stats for the admin dashboard
 * @access  Private (should be protected later)
 */
router.get('/stats', async (req, res, next) => {
    try {
        // We'll run all our data queries in parallel
        const [
            totalDonations,
            pendingVolunteers,
            totalContacts,
            donationAgg,
            totalVolunteers // <-- 1. ADDED THIS
        ] = await Promise.all([
            // 1. Get total sum of all donations
            Donation.aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            
            // 2. Get count of volunteers whose status is 'pending'
            Volunteer.countDocuments({ status: 'pending' }),
            
            // 3. Get total count of all contact inquiries
            Contact.countDocuments({}),

            // 4. Get donation history grouped by month for the chart
            Donation.aggregate([
                {
                    $group: {
                        // Group by YYYY-MM
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        total: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: 1 } } // Sort by date ascending
            ]),
            
            // --- 2. ADDED THIS QUERY ---
            // 5. Get total count of ALL volunteers (members)
            Volunteer.countDocuments({})
        ]);

        // Format the data for the Nivo line chart (needs 'x' and 'y' keys)
        const donationHistory = donationAgg.map(item => ({
            x: item._id, // The "YYYY-MM" string
            y: item.total // The total amount for that month
        }));

        // Send all stats in one clean object
        res.status(200).json({
            totalDonations: totalDonations[0]?.total || 0,
            pendingVolunteers: pendingVolunteers || 0,
            totalContacts: totalContacts || 0,
            totalVolunteers: totalVolunteers || 0, // <-- 3. ADDED THIS
            donationHistory: [
                {
                    id: 'donations',
                    color: 'hsl(140, 70%, 50%)',
                    data: donationHistory
                }
            ] // Nivo line chart format
        });

    } catch (error) {
        next(error);
    }
});

export default router;

