import { Router } from "express";
import Volunteer from '../models/volunteer.model.js'

const router = Router();
//create
router.post('/', async (req, res) => {
    try {

        const event = await Volunteer.create(req.body);
        res.status(201).json({
            message: "Volunteer form submitted successfully",
            id: event.id,
            event
        });


    } catch (error) {
        next(error);
    }

})
//Read All
router.get('/', async (req, res) => {
    try {
        const { status, category, limit } = req.query;
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const events = await Volunteer.find(query)
            .sort({ date: -1 })
            .limit(limit ? parseInt(limit) : 0);

        res.json({
            message: 'Volunteer retrieved successfully',
            count: events.length,
            events
        });

    } catch (error) {
        next(error);
    }
})
//Read Specific
router.get('/:id', async (req, res) => {
    try {
        const event = await Volunteer.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json({
            message: 'Event retrieved successfully',
            event
        })
    } catch (error) {
        next(error);
    }
})

//Update
router.patch(':id', async (req, res) => {
    try {
        const event = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!event) {
            return res.status(404).json({
                messaage: 'Event not found'
            })
        }
        res.json({
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        next(error);
    }
})
//delete
router.delete('/:id', async (req, res) => {
    try {
        const event = await Volunteer.findByIdAndDelete(
            req.params.id
        )
        if (!event) {
            return res.status(400).json({
                message: 'Volunteer does not exists with this id'
            });
        }
        return res.status(200).json({
            message: 'Volunteer deleted successfully '
        })
    } catch (error) {
        next(error);
    }

})
export default router