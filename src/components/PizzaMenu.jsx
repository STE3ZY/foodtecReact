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

  // Function to load edited prices from local storage
  const loadEditedPrices = () => {
    const storedPrices = JSON.parse(localStorage.getItem("editedPrices"));
    if (storedPrices) {
      setEditedPrices(storedPrices);
    }
  };

  useEffect(() => {
    initializeSelectedSizes();
    loadEditedPrices();
  }, []); // Empty dependency array to run this effect only once on page load

  // Function to save edited prices to local storage
  const saveEditedPrices = (newEditedPrices) => {
    localStorage.setItem("editedPrices", JSON.stringify(newEditedPrices));
  };

  const handleItemClick = (itemId) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleSizeChange = (itemId, sizeId) => {
    const newSizeState = { ...selectedSizes };
    if (!newSizeState[itemId]) {
      newSizeState[itemId] = {};
    }

    const isCurrentlySelected = newSizeState[itemId][sizeId];
    newSizeState[itemId][sizeId] = !isCurrentlySelected;

    // Clear the edited price for the size when unchecking
    if (!newSizeState[itemId][sizeId]) {
      const newEditedPrices = { ...editedPrices };
      if (newEditedPrices[itemId] && newEditedPrices[itemId][sizeId]) {
        delete newEditedPrices[itemId][sizeId];
        setEditedPrices(newEditedPrices);
        // Update local storage when unchecked
        saveEditedPrices(newEditedPrices);
      }
    } else {
      // Set the default price when checked again
      const newEditedPrices = { ...editedPrices };
      if (!newEditedPrices[itemId]) {
        newEditedPrices[itemId] = {};
      }

      // Retrieve the default price from the `Prices` array
      const defaultPrice = Prices.find(
        (price) => price.itemId === itemId && price.sizeId === sizeId
      );

      if (defaultPrice) {
        newEditedPrices[itemId][sizeId] = defaultPrice.price;
        setEditedPrices(newEditedPrices);
        // Update local storage when checked again with the default price
        saveEditedPrices(newEditedPrices);
      }
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
    saveEditedPrices(newEditedPrices); // Save the edited prices to local storage
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
