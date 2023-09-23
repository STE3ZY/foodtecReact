import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./PizzaMenu.css";

import {
  items as pizzaItems,
  itemPrices as Prices,
  itemSizes as Sizes,
} from "./data"; // Import the data from data.ts

const PizzaMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [editedPrices, setEditedPrices] = useState({});

  // Function to initialize selectedSizes with all sizes selected
  const initializeSelectedSizes = () => {
    const initialSelectedSizes = {};
    pizzaItems.forEach((item) => {
      initialSelectedSizes[item.itemId] = {};
      Sizes.forEach((size) => {
        initialSelectedSizes[item.itemId][size.sizeId] = true;
      });
    });
    setSelectedSizes(initialSelectedSizes);
  };

  useEffect(() => {
    initializeSelectedSizes();
  }, []); // Empty dependency array to run this effect only once on page load

  const handleItemClick = (itemId) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleSizeChange = (itemId, sizeId) => {
    const newSizeState = { ...selectedSizes };
    if (!newSizeState[itemId]) {
      newSizeState[itemId] = {};
    }
    newSizeState[itemId][sizeId] = !newSizeState[itemId][sizeId];

    // Clear the edited price for the size when unchecking
    if (!newSizeState[itemId][sizeId]) {
      const newEditedPrices = { ...editedPrices };
      if (newEditedPrices[itemId] && newEditedPrices[itemId][sizeId]) {
        delete newEditedPrices[itemId][sizeId];
      }
      setEditedPrices(newEditedPrices);
    }

    setSelectedSizes(newSizeState);
  };

  const handlePriceChange = (itemId, sizeId, newPrice) => {
    const newEditedPrices = { ...editedPrices };
    if (!newEditedPrices[itemId]) {
      newEditedPrices[itemId] = {};
    }
    newEditedPrices[itemId][sizeId] = parseFloat(newPrice);
    setEditedPrices(newEditedPrices);
  };

  const getPrices = (itemId) => {
    return Prices.filter((price) => price.itemId === itemId);
  };

  const getItemSizePrice = (itemId, sizeId) => {
    if (editedPrices[itemId] && editedPrices[itemId][sizeId] !== undefined) {
      return editedPrices[itemId][sizeId];
    }

    if (!selectedSizes[itemId] || !selectedSizes[itemId][sizeId]) {
      return 0.0;
    }

    const price = Prices.find(
      (price) => price.itemId === itemId && price.sizeId === sizeId
    );
    return price ? price.price : 0.0;
  };

  return (
    <Accordion>
      {pizzaItems.map((item) => (
        <Accordion.Item
          key={item.itemId}
          eventKey={item.itemId.toString()}
          className={selectedItem === item.itemId ? "active" : ""}
        >
          <Accordion.Header onClick={() => handleItemClick(item.itemId)}>
            {item.name}
          </Accordion.Header>
          <Accordion.Body>
            <ul className="size-options">
              {Sizes.map((size) => (
                <li key={size.sizeId}>
                  <label>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      onChange={() =>
                        handleSizeChange(item.itemId, size.sizeId)
                      }
                      checked={
                        selectedSizes[item.itemId] &&
                        selectedSizes[item.itemId][size.sizeId]
                      }
                    />
                    <div>{size.name}</div>
                    <div className="price-group">
                      <span>$</span>
                      <input
                        type="number"
                        value={getItemSizePrice(item.itemId, size.sizeId)}
                        onChange={(e) =>
                          handlePriceChange(
                            item.itemId,
                            size.sizeId,
                            e.target.value
                          )
                        }
                        disabled={
                          !selectedSizes[item.itemId] ||
                          !selectedSizes[item.itemId][size.sizeId]
                        }
                      />
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default PizzaMenu;
