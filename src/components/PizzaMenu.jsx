import React, { useState } from "react";
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

  const handleItemClick = (itemId) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleSizeChange = (itemId, sizeId) => {
    const newSizeState = { ...selectedSizes };

    if (newSizeState[itemId] && newSizeState[itemId][sizeId]) {
      newSizeState[itemId][sizeId] = false;
    } else {
      newSizeState[itemId] = { ...newSizeState[itemId], [sizeId]: true };
    }

    setSelectedSizes(newSizeState);
  };

  const getPrices = (itemId) => {
    return Prices.filter((price) => price.itemId === itemId);
  };

  const getItemSizePrice = (itemId, sizeId) => {
    if (selectedSizes[itemId] && !selectedSizes[itemId][sizeId]) {
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
                      checked={
                        selectedSizes[item.itemId] &&
                        selectedSizes[item.itemId][size.sizeId]
                      }
                      onChange={() =>
                        handleSizeChange(item.itemId, size.sizeId)
                      }
                    />
                    <div>{size.name}</div>
                    <div className="price-group">
                      <span>$</span>
                      <input
                        type="number"
                        value={getItemSizePrice(
                          item.itemId,
                          size.sizeId
                        ).toFixed(2)}
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
