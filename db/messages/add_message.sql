INSERT INTO test_messages
(work_order, sender_id, sender_name, message, timesent)
VALUES(
    ${work_order_id},
    ${sender_id},
    ${sender_name},
    ${message},
    CURRENT_TIMESTAMP
);