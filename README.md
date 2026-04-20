# Sarthi Hotel Web Platform

This is the source code for the Sarthi Hotel website. It is built using standard HTML, Tailwind CSS (via CDN), and Vanilla JavaScript.

## How to Update the Menu

The entire digital menu is powered by the `menu.json` file. You do not need to modify any HTML or JavaScript code to update the dishes or prices.

### Modifying `menu.json`

Open the `menu.json` file in any text editor. It looks like this:

```json
{
  "categories": ["Starters", "Main", "Maharashtrian", "Jain"],
  "items": [
    {
      "id": 1,
      "name": "Paneer Tikka",
      "description": "Cottage cheese marinated in spices and grilled in a tandoor.",
      "price": 250,
      "category": "Starters",
      "dietary": ["Vegetarian"]
    }
  ]
}
```

#### To add a new item:
1. Copy an existing item block `{ ... }`.
2. Paste it inside the `"items": [ ... ]` list, making sure there is a comma `,` separating it from the previous item.
3. Update the `id` (must be unique), `name`, `description`, `price`, `category`, and `dietary` fields.
*Note: If an item is suitable for Jain dietary restrictions, ensure `"Jain"` is included in the `dietary` array (e.g., `["Vegetarian", "Jain"]`). The system will automatically add a "Jain Available" tag and include it in the Jain filter.*

#### To update a price:
Find the item and simply change the number next to `"price"`. For example, `"price": 280`.

## How to Update the WhatsApp Number

Open `script.js` and locate this line around line 105:
```javascript
const HOTEL_PHONE = "1234567890";
```
Change `"1234567890"` to your actual business WhatsApp number (include the country code without the `+` sign, e.g., `"919876543210"`).

## Running Locally

Because the menu relies on fetching a JSON file, simply double-clicking `index.html` might not work in some browsers due to CORS policies.
To view it properly:
1. Run a local server. If you have Python installed, open the terminal in this directory and run: `python -m http.server 8000`
2. Open your browser and go to `http://localhost:8000`
