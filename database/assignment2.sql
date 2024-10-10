-- QUERY #1
INSERT INTO public.account VALUES
    (DEFAULT, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', DEFAULT);

-- QUERY #2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- QUERY #3 
DELETE FROM public.account
WHERE account_id = 1;

-- QUERY #4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- QUERY #5
SELECT inv_make, inv_model, classification_name
FROM public.inventory
    INNER JOIN public.classification
        ON public.classification.classification_id = public.inventory.classification_id
WHERE classification_name = 'Sport';

-- QUERY #6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');
    